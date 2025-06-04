import { useState, useEffect, useContext } from "react";

import InputQuestion from "./questions/InputQuestion.jsx";
import DropdownQuestion from "./questions/DropdownQuestion.jsx";
import UploadQuestion from "./questions/UploadQuestion.jsx";
import CaptchaQuestion from "./questions/CaptchaQuestion.jsx";
import KeywordQuestion from "./questions/KeywordQuestion.jsx";
import RadioQuestion from "./questions/RadioQuestion.jsx";
import RadioGameQuestion from "./questions/RadioGameQuestion.jsx";
import LocationQuestion from "./questions/LocationQuestion.jsx";

import { ThemeContext } from "./ThemeContextProvider.jsx";
import Markdown from "react-markdown";

import {
	IsPageValid,
	CheckDeathStatus,
	ShouldShowQuestion,
} from "./managers/VerificationManager.js";

function Page(props) {
	const {
		pageIndex,
		page,
		nextPage,
		prevPage,
		inputDict,
		setInputDict,
		showDeath,
		setPageIndex,
	} = props;

	const [idToQuestionsDict, setIdToQuestionsDict] = useState({});
	const [isContinueDisabled, setIsContinueDisabled] = useState(true);
	const [pageDict, setPageDict] = useState({});
	const [pageId, setPageId] = useState(null);
	const [waitingForInterruptions, setWaitingForInterruptions] =
		useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const themeContext = useContext(ThemeContext);

	useEffect(() => {
		if (pageIndex == -1) {
			setPageId("page-error");
		} else if (page.id) {
			setPageId("page-" + page.id);
		} else {
			console.error("No id for page at index " + pageIndex);
			setPageId("page-" + pageIndex);
		}

		setWaitingForInterruptions(page.interruptions != null);
	}, [page]);

	useEffect(() => {
		var newInputDict = { ...inputDict };
		newInputDict[pageId] = pageDict;
		setInputDict(newInputDict);
	}, [pageDict]);

	useEffect(() => {
		setIsContinueDisabled(
			!IsPageValid(page, pageId, inputDict, idToQuestionsDict),
		);
	}, [inputDict]);

	useEffect(() => {
		if (!pageId) {
			return;
		}
		if (inputDict[pageId]) {
			setPageDict(inputDict[pageId]);
		} else {
			// Initialize Page Dict
			var newPageDict = {};
			if (page.questions) {
				for (var i = 0; i < page.questions.length; i++) {
					newPageDict[page.questions[i].id] = "";
				}
			}
			setPageDict(newPageDict);
		}

		if (page.questions) {
			var newIdToQuestionsDict = {};
			for (var i = 0; i < page.questions.length; i++) {
				newIdToQuestionsDict[page.questions[i].id] = page.questions[i];
			}
			setIdToQuestionsDict(newIdToQuestionsDict);
		}
	}, [pageId]);

	const renderQuestion = (question) => {
		var shouldShow = ShouldShowQuestion(
			question,
			idToQuestionsDict,
			pageDict,
		);
		var questionProps = {
			pageDict: pageDict,
			setPageDict: setPageDict,
			question: question,
			id: question.id,
			inputDict: inputDict,
			setInputDict: setInputDict,
			onQuestionStarted: onQuestionStarted,
			show: shouldShow,
		};
		switch (question.type) {
			case "text":
				return (
					<div
						className={"text " + (shouldShow ? "show" : "hide")}
						id={pageId}
						key={"text-" + question.id}
					>
						{question.text}
					</div>
				);
			case "input":
				return <InputQuestion key={question.id} {...questionProps} />;
			case "dropdown":
				return (
					<DropdownQuestion key={question.id} {...questionProps} />
				);
			case "upload":
				return <UploadQuestion key={question.id} {...questionProps} />;
			case "keyword":
				return <KeywordQuestion key={question.id} {...questionProps} />;
			case "captcha":
				return <CaptchaQuestion key={question.id} {...questionProps} />;
			case "radio":
				return <RadioQuestion key={question.id} {...questionProps} />;
			case "radio-game":
				return (
					<RadioGameQuestion
						key={question.id}
						{...questionProps}
						showDeath={showDeath}
					/>
				);
			case "location":
				return (
					<LocationQuestion
						key={question.id}
						{...questionProps}
						page={page}
						showDeath={showDeath}
						idToQuestionsDict={idToQuestionsDict}
					/>
				);
			default:
				console.error("Invalid question type: " + question.type);
				return null;
		}
	};

	const onContinueClicked = () => {
		var deathStatus = CheckDeathStatus(page, pageDict, idToQuestionsDict);
		if (deathStatus) {
			showDeath(deathStatus);
		} else {
			nextPage();
		}
	};

	const onBackClicked = () => {
		prevPage();
	};

	const onHomeClicked = () => {
		setPageIndex(0);
	};

	const showBackButton = () => {
		return false;
		//return pageIndex > 0;
	};

	const onQuestionStarted = (id) => {
		processInterruptions();
	};

	const processInterruptions = () => {
		if (!waitingForInterruptions) {
			return;
		}
		for (var i in page.interruptions) {
			var interruption = page.interruptions[i];
			if (interruption.type == "alert") {
				for (var j in interruption.alerts) {
					var alertText = interruption.alerts[j];
					alert(alertText);
				}
			}
		}
		if (pageId == "page-self-id") {
			var texts = document.getElementsByClassName("text");
			for (var i in texts) {
				if (texts[i].style) {
					texts[i].style.textDecoration = "line-through";
				}
			}
			var inputs = document.getElementsByTagName("select");
			for (var i in inputs) {
				inputs[i].disabled = true;
			}
			setWaitingForInterruptions(false);
		}
	};

	return (
		<div className={"page " + themeContext.theme} id={pageId}>
			<div className={"heading " + themeContext.theme}>
				{page.title && <div className="title text">{page.title}</div>}
			</div>
			<div className="body">
				{page.texts &&
					page.texts.map((t, i) => {
						return (
							<div key={"text-" + i} className="text">
								<Markdown>{t}</Markdown>
							</div>
						);
					})}
			</div>

			{page.questions &&
				page.questions.map((question) => {
					return renderQuestion(question);
				})}

			{page.show_details && (
				<div
					className="show-details-div"
					onClick={() => setShowDetails(!showDetails)}
				>
					{showDetails ? "HIDE DETAILS ⏷" : "SHOW DETAILS ⏵"}
					{showDetails && (
						<div className="show-details-code">
							{"CODE: " + page.show_details}
						</div>
					)}
				</div>
			)}

			<div className="footer">
				<div className="button-container">
					{showBackButton() && (
						<button
							className={
								"back-button button " + themeContext.theme
							}
							onClick={onBackClicked}
						>
							Back
						</button>
					)}
					{page.continue_override != "none" && (
						<button
							className={
								"continue-button button " + themeContext.theme
							}
							disabled={isContinueDisabled}
							onClick={onContinueClicked}
						>
							{page.continue_override ?? "Continue"}
						</button>
					)}

					{page.home_override && (
						<button
							className={
								"home-button button " + themeContext.theme
							}
							onClick={onHomeClicked}
						>
							{page.home_override}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default Page;
