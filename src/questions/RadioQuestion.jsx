import { useState, useEffect } from "react";

import Markdown from "react-markdown";
import { GetInlineError } from "../managers/VerificationManager.js";

function RadioQuestion(props) {
	const { question, pageDict, setPageDict, id, onQuestionStarted, show } =
		props;

	const [inlineError, setInlineError] = useState(null);
	const [attempted, setAttempted] = useState(false);

	var questionClassName =
		"radio-question question " + (show ? "show" : "hide");

	useEffect(() => {
		if (pageDict && (pageDict[id] == null || pageDict[id] == "")) {
			rewritePageDict(getDefaultButtonValues());
		}

		if (attempted) {
			setInlineError(GetInlineError(question, pageDict[id] ?? ""));
		}
	}, [pageDict, attempted]);

	const getDefaultButtonValues = () => {
		var inputs = document.getElementsByClassName("radio-button-" + id);
		var buttonValues = [];
		for (var i = 0; i < inputs.length; i++) {
			buttonValues.push(false);
		}
		return buttonValues;
	};

	const onSelectPress = (e) => {
		var index = parseInt(e.target.id.split("-").slice(-1));

		var buttonValues = getDefaultButtonValues();
		if (question.allow_multiple) {
			buttonValues = [...pageDict[id]];
		}
		buttonValues[index] = !buttonValues[index];
		rewritePageDict(buttonValues);
		setAttempted(true);
		onQuestionStarted(id);
	};

	const rewritePageDict = (value) => {
		var newPageDict = { ...pageDict };
		newPageDict[id] = value;
		setPageDict(newPageDict);
	};

	return (
		<div className={questionClassName} id={id}>
			<div className="question-text text">
				<Markdown>{question.text}</Markdown>{" "}
				<span className="red asterix">*</span>
			</div>
			<div className="radio-container">
				{question.options.map((o, i) => {
					return (
						<div
							key={"radio-option-container-" + id + "-" + i}
							className="radio-option-container"
						>
							<input
								type="radio"
								className={"radio-button radio-button-" + id}
								id={"radio-button-" + id + "-" + i}
								checked={
									Array.isArray(pageDict[id]) &&
									pageDict[id][i] === true
								}
								onChange={onSelectPress}
							/>
							<option
								className="radio-option"
								htmlFor={"radio-button-" + id + "-" + i}
								value={o}
							>
								{o}
							</option>
						</div>
					);
				})}
			</div>
			{inlineError && <div className="error-div">{inlineError}</div>}
		</div>
	);
}

export default RadioQuestion;
