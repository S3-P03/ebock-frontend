import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1d9e75",
        },
        secondary: {
            main: "#ee74ee",
        },
        background: {
            default: "#f5f5f0",
            paper: "#ffffff",
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1d9e75",
        },
        secondary: {
            main: "#6e1975",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
    },
});