import { useState, useEffect } from "react";

import Markdown from "react-markdown";
import { GetInlineError } from "../managers/VerificationManager.js";

function DropdownQuestion(props) {
	const { question, pageDict, setPageDict, id, onQuestionStarted, show } =
		props;

	const [answer, setAnswer] = useState("");
	const [inlineError, setInlineError] = useState(null);
	const [attempted, setAttempted] = useState(false);

	var questionClassName =
		"dropdown-question question " + (show ? "show" : "hide");

	useEffect(() => {
		setAnswer(pageDict[id] ?? "");
		if (attempted) {
			setInlineError(GetInlineError(question, pageDict[id] ?? ""));
		}
	}, [pageDict, attempted]);

	const onSelectChange = (e) => {
		rewritePageDict(e.target.value);
	};

	const onSelectionAttempted = () => {
		setAttempted(true);
	};

	const rewritePageDict = (value) => {
		var newPageDict = { ...pageDict };
		newPageDict[id] = value;
		setPageDict(newPageDict);
	};

	const onSelectionClicked = () => {
		onQuestionStarted(id);
	};

	return (
		<div className={questionClassName} id={id}>
			<div className="question-text text">
				<Markdown>{question.text}</Markdown>{" "}
				<span className="red asterix">*</span>
			</div>
			<select
				className="select"
				name={"selected-" + id}
				value={answer}
				onChange={onSelectChange}
				onBlur={onSelectionAttempted}
				onClick={onSelectionClicked}
			>
				<option value={""} key={id + "-blank"}></option>
				{question.options.map((o, i) => {
					return (
						<option value={o} key={id + "-" + o}>
							{o}
						</option>
					);
				})}
			</select>
			{inlineError && <div className="error-div">{inlineError}</div>}
		</div>
	);
}

export default DropdownQuestion;
