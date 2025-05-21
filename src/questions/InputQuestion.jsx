import { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";

import Markdown from "react-markdown";
import { GetInlineError } from "../managers/VerificationManager.js";

import "../style/PhoneNumber.css";

function InputQuestion(props) {
	const { question, pageDict, setPageDict, id, onQuestionStarted, show } =
		props;

	const [input, setInput] = useState("");
	const [inlineError, setInlineError] = useState(null);
	const [attempted, setAttempted] = useState(false);

	var questionClassName = "input-question " + (show ? "show" : "hide");

	useEffect(() => {
		setInput(pageDict[id] ?? "");
		if (attempted) {
			setInlineError(GetInlineError(question, pageDict[id] ?? ""));
		}
	}, [pageDict, attempted]);

	const onInputChange = (i) => {
		onQuestionStarted(id);
		rewritePageDict(i.target.value);
	};

	const onPhoneNumberChange = (value) => {
		onQuestionStarted(id);
		rewritePageDict(value);
	};

	const onInputAttempted = () => {
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
			<div className="input-question-text text">
				<Markdown>{question.text}</Markdown>{" "}
				<span className="red asterix">*</span>
			</div>
			{question.id == "phone-question" ? (
				<PhoneInput
					placeholder={question.placeholder ?? ""}
					value={input}
					onChange={onPhoneNumberChange}
					defaultCountry="US"
					autoComplete="off"
					onBlur={onInputAttempted}
				/>
			) : (
				<input
					placeholder={question.placeholder ?? ""}
					autoComplete="off"
					type="text"
					className="input"
					value={input}
					onChange={onInputChange}
					onBlur={onInputAttempted}
				/>
			)}
			{inlineError && <div className="error-div">{inlineError}</div>}
		</div>
	);
}

export default InputQuestion;
