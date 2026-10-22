import { createContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const THEME_STORAGE_KEY = "tartila-theme";

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});
