import { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";

function Timer(props) {
	const { showDebug, timerEnd, onTimerEnd, id, timerLength } = props;
	const {
		totalMilliseconds,
		seconds,
		minutes,
		isRunning,
		start,
		pause,
		restart,
	} = useTimer({
		expiryTimestamp: timerEnd,
		onExpire: onTimerEnd,
		interval: 20,
	});

	useEffect(() => {
		restart(timerEnd);
	}, [timerEnd]);

	useEffect(() => {
		if (isRunning) {
			var time_bar = document.getElementById("remaining-time-bar-" + id);
			time_bar.style.width = getPercentLeft() + "%";
		}
	}, [totalMilliseconds]);

	const getTimeString = () => {
		var timeString = minutes + ":";
		if (seconds < 10) {
			timeString += "0";
		}
		return timeString + seconds;
	};

	const getPercentLeft = () => {
		return totalMilliseconds / (timerLength * 10);
	};

	return (
		<div className="timer" id={id}>
			{showDebug && (
				<div className="timer-debug">
					<button
						className="timer-debug-button"
						onClick={isRunning ? pause : start}
					>
						{isRunning ? "Pause" : "Start"}
					</button>
				</div>
			)}
			<div className="time-text">
				Holding your application for{" "}
				<span className="red time-amount">{getTimeString()}</span>
			</div>
			<div
				className="remaining-time-bar"
				id={"remaining-time-bar-" + id}
			></div>
		</div>
	);
}

export default Timer;
