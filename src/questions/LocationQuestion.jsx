import { useState, useEffect } from "react";

import Markdown from "react-markdown";

import usMap from "/public/images/us-map.png";
import checkmarkImg from "/public/images/checkmark.png";

import { CheckDeathStatus } from "../managers/VerificationManager.js";

function LocationQuestion(props) {
	const {
		question,
		pageDict,
		setPageDict,
		id,
		onQuestionStarted,
		show,
		page,
		showDeath,
		idToQuestionsDict,
	} = props;

	const [input, setInput] = useState("");
	const [inlineError, setInlineError] = useState(null);
	const [attempted, setAttempted] = useState(false);
	const [checkmarkMargin, setCheckmarkMargin] = useState([0, 0]);

	var questionClassName = "location-question " + (show ? "show" : "hide");

	useEffect(() => {
		setInput(pageDict[id] ?? "");
		if (attempted) {
			var deathStatus = CheckDeathStatus(
				page,
				pageDict,
				idToQuestionsDict,
			);
			if (deathStatus) {
				showDeath(deathStatus);
			}
		}
	}, [pageDict, attempted]);

	const rewritePageDict = (value) => {
		var newPageDict = { ...pageDict };
		newPageDict[id] = value;
		setPageDict(newPageDict);
	};

	const onMapClick = (e) => {
		if (attempted) {
			return;
		}
		setAttempted(true);
		onQuestionStarted(id);
		var map = document.getElementById("image-" + id);
		var offset = map.getClientRects()[0];
		var percentX = (e.clientX - offset.left) / offset.width;
		var percentY = (e.clientY - offset.top) / offset.height;
		var boundsX = [
			question.correct[0] - question.leeway,
			question.correct[0] + question.leeway,
		];
		var boundsY = [
			question.correct[1] - question.leeway,
			question.correct[1] + question.leeway,
		];
		var inBounds =
			percentX >= boundsX[0] &&
			percentX <= boundsX[1] &&
			percentY >= boundsY[0] &&
			percentY <= boundsY[1];

		var checkmarkPixelSize = window.innerWidth * 0.02;
		var marginX =
			question.correct[0] * offset.width - checkmarkPixelSize / 2;
		var marginY =
			question.correct[1] * offset.height - checkmarkPixelSize / 2;
		setCheckmarkMargin([marginX, marginY]);
		console.log("in bounds: ", inBounds);
		rewritePageDict(inBounds);
	};

	return (
		<div className={questionClassName} id={id}>
			<div className="location-question-text text">
				<Markdown>{question.text}</Markdown>{" "}
				<span className="red asterix">*</span>
			</div>
			<div className="map-div">
				<img
					className="map"
					src={usMap}
					onClick={onMapClick}
					id={"image-" + id}
				/>
				{attempted && (
					<img
						src={checkmarkImg}
						className="answer-checkmark"
						style={{
							marginLeft: checkmarkMargin[0] + "px",
							marginTop: checkmarkMargin[1] + "px",
						}}
					/>
				)}
			</div>
			{inlineError && <div className="error-div">{inlineError}</div>}
		</div>
	);
}

export default LocationQuestion;
