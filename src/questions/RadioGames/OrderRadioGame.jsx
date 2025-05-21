import { useState, useEffect } from "react";

function OrderRadioGame(props) {
	const {
		pageDict,
		rewritePageDict,
		setAttempted,
		onQuestionStarted,
		question,
		id,
		showDeath,
	} = props;

	var radioClassName = "radio-button-order radio-button-" + id;

	const [radioOrder, setRadioOrder] = useState(null);

	useEffect(() => {
		if (pageDict && (pageDict[id] == null || pageDict[id] == "")) {
			var newButtonArrayVals = getDefaultButtonValues();
			rewritePageDict(newButtonArrayVals);

			var newRadioOrder = [];
			for (var i = 0; i < question.ordered_options.length; i++) {
				newRadioOrder.push(i);
			}
			newRadioOrder.sort(() => Math.random() - 0.5); //shuffle
			setRadioOrder(newRadioOrder);
		}
	}, [pageDict]);

	const getDefaultButtonValues = () => {
		var buttonArrayValues = [];
		for (var i = 0; i < question.ordered_options.length; i++) {
			buttonArrayValues.push(false);
		}
		return buttonArrayValues;
	};

	const onSelectPress = (e) => {
		var splits = e.target.id.split("-");
		var index = parseInt(splits.slice(-1));

		var buttonValues = [...pageDict[id]];
		buttonValues[index] = !buttonValues[index];
		rewritePageDict(buttonValues);
		setAttempted(true);
		onQuestionStarted(id);

		var seenUnchecked = false;
		for (var i = 0; i < radioOrder.length; i++) {
			var button = document.getElementById(
				"radio-button-" + id + "-" + i,
			);
			if (!button.checked) {
				seenUnchecked = true;
			} else if (seenUnchecked && button.checked) {
				showDeath("CANT_ORDER");
				break;
			}
		}
	};

	return (
		<div className="radio-container">
			{radioOrder != null &&
				radioOrder.map((o, i) => {
					return (
						<div
							key={
								"radio-option-container-" +
								id +
								"-" +
								radioOrder[i]
							}
							className="radio-option-container"
						>
							<input
								type="radio"
								className={"radio-button radio-button-" + id}
								id={"radio-button-" + id + "-" + radioOrder[i]}
								checked={
									radioOrder != null &&
									pageDict[id] != null &&
									pageDict[id][radioOrder[i]] === true
								}
								onChange={onSelectPress}
							/>
							<option
								className="radio-option"
								htmlFor={
									"radio-button-" + id + "-" + radioOrder[i]
								}
								id={"radio-option-" + id + "-" + radioOrder[i]}
								value={o}
							>
								{question.ordered_options[o]}
							</option>
						</div>
					);
				})}
		</div>
	);
}

export default OrderRadioGame;
