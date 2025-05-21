import { isPossiblePhoneNumber } from "react-phone-number-input";

// Valid meaning player has filled it out, not necessarily that it's right
const IsPageValid = (page, pageId, inputDict, idToQuestionsDict) => {
	if (!page.questions) return true;

	var pageDict = inputDict[pageId];
	if (!pageDict || Object.keys(pageDict).length === 0) {
		return false; //Uninitialized
	}

	for (const inputKey in pageDict) {
		var question = idToQuestionsDict[inputKey];
		var answer = pageDict[inputKey];
		if (!IsAnswerValid(question, answer, idToQuestionsDict, pageDict)) {
			return false;
		}
	}
	return true;
};

// Valid meaning player has filled it out, not necessarily that it's right
const IsAnswerValid = (question, answer, idToQuestionsDict, pageDict) => {
	if (
		question &&
		!ShouldShowQuestion(question, idToQuestionsDict, pageDict)
	) {
		return true; //Case for hidden questions, we would still want the player to continue if they don't see them
	}
	if (
		question &&
		isRadioQuestion(question) &&
		!isRadioAnswerValid(question, answer)
	) {
		return false;
	}

	if (
		GetInlineError(question, answer) &&
		ShouldShowQuestion(question, idToQuestionsDict, pageDict)
	) {
		return false;
	}
	return true;
};

// Valid meaning player has filled it out, not necessarily that it's right
// Used to gate the Continue button
const isRadioAnswerValid = (question, answer) => {
	if (!answer || !Array.isArray(answer) || answer.every((e) => e === false)) {
		return false; // Nothing selected
	}
	if (question.must_have_to_continue) {
		if (Array.isArray(question.must_have_to_continue)) {
			for (var i = 0; i < question.must_have_to_continue.length; i++) {
				if (
					answer.length > question.must_have_to_continue[i] &&
					!answer[question.must_have_to_continue[i]]
				) {
					return false;
				}
			}
		} else if (
			question.must_have_to_continue == "all" &&
			Array.isArray(answer)
		) {
			if (question.game_type == "array" && Array.isArray(answer[0])) {
				// row/column of answers
				return answer.every((row) => row.every((e) => e === true));
			}

			if (question.game_type == "runaway") {
				return answer.every((e) => e[1] == true);
			}
			return answer.every((e) => e === true);
		}
	}
	return true;
};

const GetInlineError = (question, answer) => {
	if (!question || question.no_error || question.type == "text") {
		return null;
	}
	if (question.type == "keyword" && (!answer || answer == "")) {
		return "Error: Must pick at least one skill.";
	}
	if (!answer || answer == "") {
		return "Error: Answer is required.";
	}
	if (question.checks) {
		if (
			question.checks.includes("phone") &&
			!isPossiblePhoneNumber(answer)
		) {
			return "Error: Invalid Phone Number.";
		}

		if (question.checks.includes("text-only") && !isValidTextOnly(answer)) {
			return "Error: Numbers don't belong in names.";
		}

		if (question.checks.includes("email") && !isValidEmail(answer)) {
			return "Error: Invalid email format.";
		}
	}
	return null;
};

// Some questions need to be not just answered, but answered CORRECTLY, for other things to trigger.
const IsAnswerCorrect = (question, answer) => {
	if (!question || !answer) {
		return false;
	}
	if (isRadioQuestion(question)) {
		return IsRadioQuestionCorrect(question, answer);
	}

	if (!question.correct && !question.incorrect) {
		return true;
	}
	if (question.correct) {
		return answer == question.correct;
	}
	if (question.incorrect) {
		return answer != question.incorrect;
	}
};

const IsRadioQuestionCorrect = (question, answer) => {
	if (!question.correct && !question.incorrect) {
		return true;
	}
	if (question.correct && Array.isArray(answer)) {
		return !checkForDeathArray(answer, question.correct);
	}
	return true;
};

const CheckDeathStatus = (page, pageDict, idToQuestionsDict) => {
	if (!page.death) {
		return null;
	}
	for (var i = 0; i < page.death.length; i++) {
		var question = idToQuestionsDict[page.death[i].id];
		var answer = pageDict[page.death[i].id];
		// radio questions have an array of answers that should be checked
		if (isRadioQuestion(question)) {
			if (checkForDeathArray(answer, question.correct)) {
				return page.death[i].status;
			}
		} else if (question.type == "location") {
			if (!answer) {
				return page.death[i].status;
			}
		} else if (question.incorrect && answer == question.incorrect) {
			return page.death[i].status;
		} else if (question.correct && answer != question.correct) {
			return page.death[i].status;
		}
	}
	return null;
};

const ShouldShowQuestion = (question, idToQuestionsDict, pageDict) => {
	if (!question) {
		return false;
	}
	if (!idToQuestionsDict) {
		return true;
	}
	var prerequisiteQuestion =
		idToQuestionsDict[question.prerequisite_question];
	if (!prerequisiteQuestion) {
		return true;
	}
	var prerequisiteAnswer = pageDict[prerequisiteQuestion.id];

	if (question.prerequisite_must_be_correct) {
		if (!IsAnswerCorrect(prerequisiteQuestion, prerequisiteAnswer)) {
			return false;
		}
	}

	return (
		IsAnswerValid(prerequisiteQuestion, prerequisiteAnswer) &&
		ShouldShowQuestion(prerequisiteQuestion, idToQuestionsDict, pageDict)
	);
};

const checkForDeathArray = (answerArray, correctArray) => {
	for (var i = 0; i < correctArray.length; i++) {
		if (answerArray[i] != correctArray[i]) {
			return true;
		}
	}
	return false;
};

const isValidTextOnly = (text) => {
	return !/\d/.test(text);
};

const isValidEmail = (email) => {
	return email
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);
};

const isRadioQuestion = (question) => {
	return (
		question != null &&
		(question.type == "radio" || question.type == "radio-game")
	);
};

export {
	GetInlineError,
	IsPageValid,
	CheckDeathStatus,
	IsAnswerValid,
	IsAnswerCorrect,
	IsRadioQuestionCorrect,
	isRadioQuestion,
	ShouldShowQuestion,
};
