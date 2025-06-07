import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeContextProvider.jsx";

import Page from "./Page.jsx";
import Timer from "./Timer.jsx";
import ThemeContextProvider from "./ThemeContextProvider.jsx";
import Debug from "./Debug.jsx";

import pageData from "./data/pages.json";
import deathData from "./data/death.json";

import "./style/App.css";
import "./style/ThemeWhite.css";

function App() {
	const [showDebug, setShowDebug] = useState(false);

	const [pages, setPages] = useState(pageData);
	const [deathPages, setDeathPages] = useState(deathData);
	const [currentPage, setCurrentPage] = useState(null);
	const [pageIndex, setPageIndex] = useState(0);
	const [inputDict, setInputDict] = useState({});
	const [timerEnd, setTimerEnd] = useState(null);

	const themeContext = useContext(ThemeContext);

	useEffect(() => {
		if (pageIndex > -1 && pages[pageIndex] != null) {
			setCurrentPage(pages[pageIndex]);
		} else if (pageIndex != -1) {
			console.error("Invalid page index ", pageIndex);
		}
	}, [pageIndex]);

	useEffect(() => {
		if (!currentPage) {
			return;
		}
		if (currentPage.timer) {
			const newEndTime = new Date();
			newEndTime.setSeconds(newEndTime.getSeconds() + currentPage.timer);
			setTimerEnd(newEndTime);
		} else if (!currentPage.timer && timerEnd != null) {
			setTimerEnd(null);
		}
	}, [currentPage]);

	const nextPage = () => {
		if (pages.length <= pageIndex) {
			return;
		}
		setPageIndex(pageIndex + 1);
	};

	const prevPage = () => {
		if (pageIndex < 1) {
			return;
		}
		setPageIndex(pageIndex - 1);
	};

	const showDeath = (reason) => {
		var deathPage = null;
		if (deathPages[reason]) {
			deathPage = deathPages[reason];
		} else {
			deathPage = deathPages["DEFAULT"];
			deathPage.show_details = reason;
		}

		setPages([
			...pages.slice(0, pageIndex + 1),
			deathPage,
			...pages.slice(pageIndex + 1),
		]);
		nextPage();
	};

	const goHome = () => {
		setPageIndex(0);
		setPages(pageData);
	};

	const onTimerEnd = () => {
		setTimerEnd(null);
		showDeath("TIMER");
	};

	return (
		<ThemeContextProvider>
			<Debug
				pages={pages}
				showDebug={showDebug}
				setShowDebug={setShowDebug}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
			<div id="content " className={themeContext}>
				<div id="banner" className={themeContext}>
					{timerEnd && (
						<Timer
							timerEnd={timerEnd}
							onTimerEnd={onTimerEnd}
							id={pageIndex}
							timerLength={currentPage.timer}
							showDebug={showDebug}
						/>
					)}
				</div>
				<div id="page-container" className={themeContext}>
					<div id="margin" className={themeContext}></div>
					<div
						id="main-pages"
						className={themeContext}
						style={{
							marginTop: "-" + pageIndex * 100 + "vh",
						}}
					>
						{pages.map((page, i) => {
							if (Math.abs(pageIndex - i) > 1) {
								return (
									<div key={i} className="empty-page"></div>
								);
							}
							return (
								<Page
									key={i}
									page={page}
									pageIndex={i}
									nextPage={nextPage}
									prevPage={prevPage}
									inputDict={inputDict}
									setInputDict={setInputDict}
									showDeath={showDeath}
									goHome={goHome}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</ThemeContextProvider>
	);
}

export default App;
