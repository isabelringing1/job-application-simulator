import { useState, useEffect } from "react";

function RunawayRadioGame(props) {
	const {
		pageDict,
		rewritePageDict,
		setAttempted,
		onQuestionStarted,
		question,
		id,
	} = props;

	var radioClassName = "radio-button-runaway radio-button-" + id;

	const [radioButtonArray, setRadioButtonArray] = useState(null);

	useEffect(() => {
		if (pageDict && (pageDict[id] == null || pageDict[id] == "")) {
			var newButtonArrayVals = getDefaultButtonValues();
			setRadioButtonArray(newButtonArrayVals);
			rewritePageDict(newButtonArrayVals);
		}
	}, [pageDict]);

	const getDefaultButtonValues = () => {
		var buttonArrayValues = [];
		for (var i = 0; i < question.options.length; i++) {
			buttonArrayValues.push([[0, i * 4], false]);
		}
		return buttonArrayValues;
	};

	const onSelectPress = (e) => {
		var splits = e.target.id.split("-");
		var index = parseInt(splits.slice(-1));

		var buttonValues = getDefaultButtonValues();
		if (question.allow_multiple) {
			buttonValues = [...pageDict[id]];
		}
		buttonValues[index][1] = !buttonValues[index][1];
		rewritePageDict(buttonValues);
		setRadioButtonArray(buttonValues);
		setAttempted(true);
		onQuestionStarted(id);
	};

	const onMouseMoveRadio = (e) => {
		var splits = e.target.id.split("-");
		var index = parseInt(splits.slice(-1));

		var question = document.getElementById("runaway-radio-div-" + index);

		var centerOfDivY =
			question.getBoundingClientRect().top + question.offsetHeight / 2;
		var centerOfDivX =
			question.getBoundingClientRect().left + question.offsetWidth / 2;
		var distanceX = centerOfDivX - e.clientX;
		var distanceY = centerOfDivY - e.clientY;

		var newLeft = radioButtonArray[index][0][0] + distanceX * 0.05;
		var newTop = radioButtonArray[index][0][1] + distanceY * 0.05;

		var newRadioButtonArray = [...radioButtonArray];
		newRadioButtonArray[index][0] = [newLeft, newTop];
		setRadioButtonArray(newRadioButtonArray);
		rewritePageDict(newRadioButtonArray);
	};

	return (
		<div
			className="radio-container"
			style={{
				height: question.options.length * 4 + "vh",
			}}
		>
			{question.options.map((o, i) => {
				return (
					<span
						key={"radio-option-container-" + id + "-" + i}
						className="radio-option-container-runaway"
						style={{
							marginLeft: radioButtonArray
								? radioButtonArray[i][0][0] + "vw"
								: "0",
							marginTop: radioButtonArray
								? radioButtonArray[i][0][1] + "vh"
								: i * 4 + "vh",
						}}
					>
						<div
							className="runaway-radio-div"
							id={"runaway-radio-div-" + i}
							onMouseMove={onMouseMoveRadio}
						>
							<input
								type="radio"
								className={radioClassName}
								id={"radio-button-runaway" + id + "-" + i}
								checked={
									radioButtonArray
										? radioButtonArray[i][1] == true
										: false
								}
								onFocus={onSelectPress}
								onChange={onSelectPress}
							/>
						</div>

						<option
							className="radio-option"
							htmlFor={"radio-button-" + id + "-" + i}
							value={o}
						>
							{o}
						</option>
					</span>
				);
			})}
		</div>
	);
}

export default RunawayRadioGame;
