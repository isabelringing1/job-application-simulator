import { useState, useEffect, useContext } from "react";

import { ThemeContext } from "./ThemeContextProvider.jsx";

function ProgressCircle(props) {
	const { inProgress } = props;
	const themeContext = useContext(ThemeContext);

	var innerClassName = "progress-circle-inner " + themeContext.theme;
	if (inProgress) {
		innerClassName += " in-progress-circle";
	}
	return (
		<div className={"progress-circle-container " + themeContext.theme}>
			<div className={"progress-circle " + themeContext.theme}>
				<div className={innerClassName}></div>
			</div>
		</div>
	);
}

export default ProgressCircle;
