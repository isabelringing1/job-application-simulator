import { useState, createContext } from "react";

export const ThemeContext = createContext("ThemeWhite");

export default function ThemeContextProvider({ children }) {
	const [theme, setTheme] = useState("ThemeWhite");

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
