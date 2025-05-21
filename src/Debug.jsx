import { useRef, useEffect } from "react";

function Debug(props) {
	const pageIndexRef = useRef();

	const {
		pages,
		showDebug,
		setShowDebug,
		currentPage,
		setCurrentPage,
		setPageIndex,
		pageIndex,
	} = props;

	const devMode = false;

	useEffect(() => {
		document.addEventListener("keydown", (event) => {
			if (event.code === "KeyD") {
				toggleShowDebug();
			}
		});
		return document.removeEventListener("keydown", (event) => {
			if (event.code === "KeyD") {
				toggleShowDebug();
			}
		});
	}, []);

	const skipQuestion = () => {
		setPageIndex(pageIndex + 1);
	};

	const toggleShowDebug = () => {
		setShowDebug((prevShowDebug) => !prevShowDebug);
	};

	return devMode && showDebug ? (
		<div className="debug-menu">
			<div className="cheats debug-column">
				{pages.map((p, i) => {
					return (
						<div key={"page-" + i}>
							<a
								className="debug-link"
								onClick={() => {
									setCurrentPage(p);
									setPageIndex(i);
								}}
								style={{
									color: i == pageIndex ? "purple" : "blue",
								}}
							>
								{p.id}
							</a>
						</div>
					);
				})}
				<div>page index: {pageIndex}</div>
				<input type="int" ref={pageIndexRef} className="debug-input" />
				<button
					id="set-page-button"
					onClick={() => {
						setPageIndex(parseInt(pageIndexRef.current.value));
					}}
				>
					Go to Page
				</button>
				<br />
				<button id="set-page-button" onClick={skipQuestion}>
					Skip
				</button>
			</div>
		</div>
	) : null;
}

export default Debug;
