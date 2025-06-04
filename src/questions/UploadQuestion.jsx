import { useRef, useState, useEffect } from "react";

import uploadImg from "/images/upload.png";
import checkmarkImg from "/images/checkmark.png";

import Markdown from "react-markdown";

function UploadQuestion(props) {
	const { question, pageDict, setPageDict, id, onQuestionStarted } = props;

	const [uploaded, setUploaded] = useState(false);

	useEffect(() => {
		var input = document.getElementById("file-upload-" + id);
		input.addEventListener("change", onInputChange);
	}, []);

	const onInputChange = () => {
		onQuestionStarted();
		var input = document.getElementById("file-upload-" + id);
		rewritePageDict(input.files != null);
		if (input.files != null) {
			setUploaded(true);
		}
	};

	const rewritePageDict = (value) => {
		var newPageDict = { ...pageDict };
		newPageDict[id] = value;
		setPageDict(newPageDict);
	};

	return (
		<div className="upload-question question" id={id}>
			<div className="question-text text">
				<Markdown>
					{uploaded && question.done_text
						? question.done_text
						: question.text}
				</Markdown>{" "}
				<span className="red asterix">*</span>
			</div>
			{uploaded ? (
				<div className="file-upload-div">
					<img src={checkmarkImg} className="upload-icon" />
				</div>
			) : (
				<label
					htmlFor={"file-upload-" + id}
					className="file-upload-div"
				>
					<img src={uploadImg} className="upload-icon" />
				</label>
			)}

			<input
				className="file-upload"
				id={"file-upload-" + id}
				type="file"
			/>
		</div>
	);
}

export default UploadQuestion;
