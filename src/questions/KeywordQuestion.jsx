import { useState, useEffect } from "react";
import { GetInlineError } from "../managers/VerificationManager.js";

function KeywordQuestion(props) {
	const { question, pageDict, setPageDict, id, onQuestionStarted } = props;

	const [input, setInput] = useState("");
	const [keywords, setKeywords] = useState([]);
	const [inlineError, setInlineError] = useState(null);
	const [attempted, setAttempted] = useState(false);

	var datalist = document.getElementById("datalist-" + id);
	var inputField = document.getElementById("input-" + id);

	useEffect(() => {
		setInput(pageDict[id] ?? "");
		if (attempted) {
			setInlineError(GetInlineError(question, pageDict[id] ?? ""));
		}
	}, [pageDict, attempted]);

	const onInputChange = (i) => {
		onQuestionStarted(id);
		var text = i.target.value.toUpperCase();
		for (let option of datalist.options) {
			if (option.value.toUpperCase().indexOf(text) > -1) {
				option.style.display = "block";
			} else {
				option.style.display = "none";
			}
		}
	};

	const onInputAttempted = () => {
		onQuestionStarted(id);
		setAttempted(true);
	};

	const rewritePageDict = (value) => {
		var newPageDict = { ...pageDict };
		newPageDict[id] = value;
		setPageDict(newPageDict);
	};

	const onFocus = () => {
		datalist.style.display = "block";
		inputField.style.borderRadius = "5px 5px 0 0";
	};

	const onOptionSelect = (o) => {
		inputField.value = "";
		clearOptions();
		var newKeywords = [...keywords];
		newKeywords.push(o);
		setKeywords(newKeywords);
		rewritePageDict(newKeywords);
	};

	const clearOptions = () => {
		for (let option of datalist.options) {
			option.style.display = "none";
		}
	};

	const isOptionSelected = (option) => {
		return keywords.indexOf(option) != -1;
	};

	const clearOption = (option) => {
		var index = keywords.indexOf(option);
		if (index != -1) {
			var newKeywords = keywords.filter((_, i) => i != index);
			setKeywords(newKeywords);
			rewritePageDict(newKeywords);
		}
	};

	return (
		<div className="keyword-question">
			<input
				autoComplete="off"
				role="combobox"
				list=""
				id={"input-" + id}
				className="keyword-input input"
				name="browsers"
				placeholder={question.placeholder ?? ""}
				onChange={onInputChange}
				onFocus={onFocus}
				onBlur={onInputAttempted}
			></input>
			<datalist id={"datalist-" + id} className="datalist">
				{question.options.map((o, i) => {
					return isOptionSelected(o) ? null : (
						<option
							className="option"
							value={o}
							key={"option-" + id + "-" + i}
							onClick={() => onOptionSelect(o)}
						>
							{o}
						</option>
					);
				})}
			</datalist>
			{inlineError && <div className="error-div">{inlineError}</div>}

			<div className="skills-list">
				{keywords.map((k, i) => {
					return (
						<span className="keyword" key={"keyword-" + i}>
							{k}{" "}
							<span
								className="red x-button"
								onClick={() => {
									clearOption(k);
								}}
							>
								ㄨ
							</span>
						</span>
					);
				})}
			</div>
		</div>
	);
}

export default KeywordQuestion;
