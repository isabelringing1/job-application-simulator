import { useState, useEffect } from "react";

import check from "/images/blue_check.png";

const CAPTCHA_ROOT = "./images/captchas/";

function CaptchaPage(props) {
	const {
		captchaPageIndex,
		setCaptchaPageIndex,
		page,
		id,
		goToNextCaptchaPage,
		showProcessing,
	} = props;

	const [imageCoords, setImageCoords] = useState([]);
	const [imageStates, setImageStates] = useState([]);
	const [imageOrder, setImageOrder] = useState([]);
	const [numSelected, setNumSelected] = useState(0);

	const [showingError, setShowingError] = useState(false);

	useEffect(() => {
		if (!page) {
			return;
		}
		var newCoords = [];
		var newStates = [];
		var newOrder = [];
		for (var i = 0; i < page.dimension; i++) {
			var newRow = [];
			for (var j = 0; j < page.dimension; j++) {
				newCoords.push([j, i]);
				newRow.push(false);
				newOrder.push(i * page.dimension + j);
			}
			newStates.push(newRow);
		}
		if (page.preselected) {
			for (var i = 0; i < page.preselected.length; i++) {
				var coord = page.preselected[i];
				newStates[coord[0]][coord[1]] = true;
			}
			setNumSelected(page.preselected.length);
		}
		if (page.scramble) {
			newOrder.sort(() => Math.random() - 0.5); //shuffle
		}
		setImageCoords(newCoords);
		setImageStates(newStates);
		setImageOrder(newOrder);
	}, [page]);

	const onImagePressed = (e) => {
		var coords = e.target.id.split("-").slice(-2);
		var newStates = [...imageStates];
		var isSelected = newStates[parseInt(coords[0])][parseInt(coords[1])];
		newStates[parseInt(coords[0])][parseInt(coords[1])] = !isSelected;
		setImageStates(newStates);
		var offset = isSelected ? -1 : 1;
		setNumSelected(numSelected + offset);
	};

	const getPathFromCoords = (x, y) => {
		var root = CAPTCHA_ROOT + page.image_id + "/" + page.image_id;
		return root + x + "." + y + ".png";
	};

	const onVerifyPressed = () => {
		if (showingError) {
			return;
		}
		if (isCorrect()) {
			goToNextCaptchaPage();
		} else {
			showIncorrect();
		}
	};

	const showIncorrect = () => {
		if (showingError) {
			return;
		}
		setShowingError(true);
		setTimeout(() => {
			setShowingError(false);
		}, 1000);
	};

	const getButtonText = () => {
		if (showProcessing) {
			if (page.post_text) {
				return page.post_text;
			}
			return "• • •";
		}
		if (showingError) {
			return "WRONG";
		}
		return "VERIFY";
	};

	const isCorrect = () => {
		if (page.answer_sets) {
			return isValidAnswerSet();
		}

		for (var i = 0; i < page.answers.length; i++) {
			var coord = page.answers[i];
			if (!imageStates[coord[0]][coord[1]]) {
				console.log("not selected: ", coord[0], ", " + coord[1]);
				return false;
			}
		}
		return page.answers.length == numSelected;
	};

	const isCaptchaButtonDisabled = () => {
		if (numSelected == 0) {
			return true;
		}
		if (page.answer_sets) {
			return !isValidAnswerSet();
		}

		return false;
	};

	const isValidAnswerSet = () => {
		for (var i = 0; i < page.answer_sets.length; i++) {
			var couldBeSet = true;
			for (var j = 0; j < page.answer_sets[i].length && couldBeSet; j++) {
				var coord = page.answer_sets[i][j];
				if (!imageStates[coord[0]][coord[1]]) {
					couldBeSet = false;
				}
			}
			if (couldBeSet) {
				return page.answer_sets[i].length == numSelected;
			}
		}
		return false;
	};

	var gridC = "captcha-images-grid grid-dimension-" + page.dimension;
	var checkmarkC = "captcha-checkmark checkmark-dimension-" + page.dimension;

	return (
		<div className="captcha-page" id={id}>
			<div className="captcha-header">
				<div className="captcha-header-text">
					{page.prompt_text_before}
				</div>
				<div className="captcha-header-text-big">
					{page.prompt_text}
				</div>
				<div className="captcha-header-text">
					{page.prompt_text_after}
				</div>
			</div>
			<div className="captcha-body">
				{showProcessing && (
					<div className="processing-div">
						<span
							className="captcha-spinner-container"
							id={"captcha-spinner-container-" + id}
							style={{ opacity: 1 }}
						>
							<span
								className="captcha-spinner"
								id={"captcha-spinner-" + id}
							></span>
						</span>
					</div>
				)}
				<div className={gridC} id={"captcha-images-grid-" + id}>
					{imageOrder.map((index, i) => {
						var mapCoord = imageCoords[index];
						var selected = imageStates[mapCoord[0]][mapCoord[1]];
						var c = "captcha-image";
						if (selected) {
							c += " image-selected";
						}
						return (
							<div
								key={"captcha-image-" + page.image_id + "-" + i}
							>
								<img
									src={getPathFromCoords(
										mapCoord[0],
										mapCoord[1],
									)}
									className={c}
									onClick={onImagePressed}
									id={
										"captcha-image-" +
										mapCoord[0] +
										"-" +
										mapCoord[1]
									}
								/>
								{selected && (
									<img src={check} className={checkmarkC} />
								)}
							</div>
						);
					})}
				</div>
			</div>
			<div className="captcha-footer">
				<button
					className={
						showingError
							? "captcha-verify-button error-button"
							: "captcha-verify-button"
					}
					onClick={onVerifyPressed}
					disabled={isCaptchaButtonDisabled()}
				>
					{getButtonText()}
				</button>
			</div>
		</div>
	);
}

export default CaptchaPage;
