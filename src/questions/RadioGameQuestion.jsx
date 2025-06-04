import { useState, useEffect } from "react";
import ArrayRadioGame from "./RadioGames/ArrayRadioGame.jsx";
import RunawayRadioGame from "./RadioGames/RunawayRadioGame.jsx";
import OrderRadioGame from "./RadioGames/OrderRadioGame.jsx";

import Markdown from "react-markdown";
import { GetInlineError } from "../managers/VerificationManager.js";

function RadioGameQuestion(props) {
	const {
		question,
		pageDict,
		setPageDict,
		id,
		onQuestionStarted,
		show,
		showDeath,
	} = props;

	const [inlineError, setInlineError] = useState(null);
	const [attempted, setAttempted] = useState(false);

	var questionClassName =
		"radio-game-question question " + (show ? "show" : "hide");

	useEffect(() => {
		if (attempted) {
			setInlineError(GetInlineError(question, pageDict[id] ?? ""));
		}
	}, [pageDict, attempted]);

	const rewritePageDict = (value) => {
		var newPageDict = { ...pageDict };
		newPageDict[id] = value;
		setPageDict(newPageDict);
	};

	const renderGame = () => {
		switch (question.game_type) {
			case "array":
				return (
					<ArrayRadioGame
						pageDict={pageDict}
						rewritePageDict={rewritePageDict}
						setAttempted={setAttempted}
						onQuestionStarted={onQuestionStarted}
						question={question}
						id={id}
					/>
				);
			case "runaway":
				return (
					<RunawayRadioGame
						pageDict={pageDict}
						rewritePageDict={rewritePageDict}
						setAttempted={setAttempted}
						onQuestionStarted={onQuestionStarted}
						question={question}
						id={id}
					/>
				);
			case "order":
				return (
					<OrderRadioGame
						pageDict={pageDict}
						rewritePageDict={rewritePageDict}
						setAttempted={setAttempted}
						onQuestionStarted={onQuestionStarted}
						question={question}
						id={id}
						showDeath={showDeath}
					/>
				);
		}
	};

	return (
		<div className={questionClassName} id={id}>
			<div className="question-text text">
				<Markdown>{question.text}</Markdown>{" "}
				<span className="red asterix">*</span>
			</div>
			{renderGame()}
			{inlineError && <div className="error-div">{inlineError}</div>}
		</div>
	);
}

export default RadioGameQuestion;
