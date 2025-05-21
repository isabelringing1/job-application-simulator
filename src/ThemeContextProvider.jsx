import { useState, createContext } from "react";

export const ThemeContext = createContext("ThemeBeige");

export default function ThemeContextProvider({ children }) {
	const [theme, setTheme] = useState("ThemeBeige");

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
