    import { createContext, useReducer, useContext, useEffect } from 'react';

    // Load theme from localStorage or default to 'light'
    const initialState = {
        theme: localStorage.getItem("theme") || "light",
    };

    const ThemeReducer = (state, action) => {
        switch (action.type) {
            case "TOGGLE_THEME":
                const newTheme = state.theme === "light" ? "dark" : "light";
                localStorage.setItem("theme", newTheme); // Save theme to localStorage
                return {
                    ...state,
                    theme: newTheme,
                };
            default:
                return state;
        }
    };

    const ThemeContext = createContext();

    export const ThemeProvider = ({ children }) => {
        const [state, dispatch] = useReducer(ThemeReducer, initialState);

        // Apply the theme to the entire body
        useEffect(() => {
            document.body.className = state.theme; // Add theme class to body
        }, [state.theme]);

        return (
            <ThemeContext.Provider value={{ state, dispatch }}>
                {children}
            </ThemeContext.Provider>
        );
    };

    export const useTheme = () => {
        const context = useContext(ThemeContext);
        if (!context) {
            throw new Error('useTheme must be used within a ThemeProvider');
        }
        return context;
    };