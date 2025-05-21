import { useState, useEffect } from "react";

function ArrayRadioGame(props) {
	const {
		pageDict,
		rewritePageDict,
		setAttempted,
		onQuestionStarted,
		question,
		id,
	} = props;

	const [radioButtonArray, setRadioButtonArray] = useState([false]);

	useEffect(() => {
		if (pageDict && (pageDict[id] == null || pageDict[id] == "")) {
			var newButtonArrayVals = getDefaultButtonValues();
			setRadioButtonArray(newButtonArrayVals);
			rewritePageDict(newButtonArrayVals);
		}
	}, [pageDict]);

	var radioClassName =
		"radio-button radio-button-" + id + " " + question.behavior;

	const getDefaultButtonValues = () => {
		var buttonArrayValues = [];
		for (var i = 0; i < question.rows; i++) {
			var buttonValues = [];
			for (var j = 0; j < question.columns; j++) {
				buttonValues.push(false);
			}
			buttonArrayValues.push(buttonValues);
		}
		return buttonArrayValues;
	};

	const onSelectPress = (e) => {
		var splits = e.target.id.split("-");
		var row = parseInt(splits.slice(-1));
		var column = parseInt(splits.slice(-2));

		var buttonValues = getDefaultButtonValues();
		if (question.allow_multiple) {
			buttonValues = [...pageDict[id]];
		}
		buttonValues[column][row] = !buttonValues[column][row];
		rewritePageDict(buttonValues);
		setRadioButtonArray(buttonValues);
		setAttempted(true);
		onQuestionStarted(id);
	};

	return (
		<div className="radio-container">
			{radioButtonArray.map((row, i) => {
				return (
					<div
						key={"radio-row-" + id + "-" + i}
						className="radio-row"
					>
						{row &&
							row.map((o, j) => {
								var animDelay = 0.05 * (i + 1) * (j + 1);
								return (
									<span
										key={
											"radio-option-container-" +
											id +
											"-" +
											i +
											"-" +
											j
										}
										className="radio-option-container"
									>
										<input
											type="radio"
											className={radioClassName}
											id={
												"radio-button-" +
												id +
												"-" +
												i +
												"-" +
												j
											}
											style={{
												animationDelay: animDelay + "s",
											}}
											checked={o == true}
											onFocus={onSelectPress}
											onChange={onSelectPress}
										/>
										<option
											className="radio-option"
											htmlFor={
												"radio-button-" + id + "-" + i
											}
										>
											{"Option " + (i + j + 1)}
										</option>
									</span>
								);
							})}
					</div>
				);
			})}
		</div>
	);
}

export default ArrayRadioGame;
