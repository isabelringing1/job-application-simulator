import { useState, useEffect } from "react";
import CaptchaPage from "../CaptchaPage";

import captchaImg from "/images/captcha.png";
import checkmarkImg from "/images/checkmark.png";

import Markdown from "react-markdown";

import "../style/Captcha.css";

function CaptchaQuestion(props) {
	const { question, pageDict, setPageDict, id, onQuestionStarted } = props;

	const [inlineError, setInlineError] = useState(null);
	const [inProgress, setInProgress] = useState(false);
	const [showCaptchaPage, setShowCaptchaPage] = useState(false);
	const [captchaPageIndex, setCaptchaPageIndex] = useState(0);
	const [showCaptchaProcessing, setShowCaptchaProcessing] = useState(false);

	useEffect(() => {
		var input = document.getElementById("captcha-checkbox-" + id);
		var spinner = document.getElementById(
			"captcha-spinner-container-" + id,
		);
		var checkmark = document.getElementById(
			"captcha-green-checkmark-" + id,
		);
		if (inProgress && !isComplete()) {
			input.style.opacity = "0";
			spinner.style.opacity = "1";
			setTimeout(() => {
				setShowCaptchaPage(true);
			}, [400]);
		}
		if (!inProgress && isComplete()) {
			setShowCaptchaPage(false);
			setTimeout(() => {
				spinner.style.animation =
					"bounce-out 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) 1 normal forwards";
				checkmark.style.animation =
					"bounce-in 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) 1 normal forwards";
			}, [200]);
		}
	}, [inProgress]);

	const rewritePageDict = (value) => {
		var newPageDict = { ...pageDict };
		newPageDict[id] = value;
		setPageDict(newPageDict);
	};

	const goToNextCaptchaPage = () => {
		if (!inProgress) {
			//or wrong
			return;
		}
		if (captchaPageIndex < question.pages.length - 1) {
			setCaptchaPageIndex(captchaPageIndex + 1);
		} else {
			setShowCaptchaProcessing(true);
			setTimeout(() => {
				setShowCaptchaProcessing(false);
				setInProgress(false);
				rewritePageDict(true);
			}, [400]);
		}
	};

	const isComplete = () => {
		return pageDict[id] != "" && pageDict[id] != undefined;
	};

	return (
		<div className="captcha-question question" id={id}>
			<div className="question-text text">
				<Markdown>{question.text}</Markdown>{" "}
				<span className="red asterix">*</span>
			</div>
			<div className="captcha-button">
				<input
					className="checkbox captcha-checkbox"
					id={"captcha-checkbox-" + id}
					type="checkbox"
					checked={isComplete()}
					onChange={(e) => {
						if (inProgress && !isComplete()) {
							return;
						}
						setInProgress(true);
						onQuestionStarted(id);
					}}
				/>
				<span
					className="captcha-spinner-container"
					id={"captcha-spinner-container-" + id}
				>
					<span
						className="captcha-spinner"
						id={"captcha-spinner-" + id}
					></span>
				</span>

				<span className="captcha-button-text">
					{question.button_text}
				</span>
				<img src={captchaImg} className="captcha-img" />
				<img
					src={checkmarkImg}
					className="captcha-green-checkmark"
					id={"captcha-green-checkmark-" + id}
				/>
			</div>
			{showCaptchaPage &&
				question.pages.map((page, i) => {
					return (
						<CaptchaPage
							captchaPageIndex={captchaPageIndex}
							setCaptchaPageIndex={setCaptchaPageIndex}
							page={page}
							goToNextCaptchaPage={goToNextCaptchaPage}
							id={id + "-page-" + i}
							key={id + "-page-" + i}
							showProcessing={showCaptchaProcessing}
						/>
					);
				})}

			{inlineError && <div className="error-div">{inlineError}</div>}
		</div>
	);
}

export default CaptchaQuestion;
