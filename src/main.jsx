import "./index.css";
import React from "react";
import ErrorPage from "./error-page";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Root from "./routes/root";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import AboutUs from "./routes/AboutUs";
import ScrollToTop from "./components/ScrollToTop";
import UploadGoals from "./routes/UploadGoals";
import GoalsStats from "./routes/GoalsStats";
import Sgc from "./routes/Sgc";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import "./index.css";

const theme = createTheme({
    typography: {
        fontFamily: [
            "Inter",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
    palette: {
        primary: {
            main: "#0076A8",
        },
        secondary: {
            main: "#59CBE8",
        },
        text: {
            primary: "#131313",
            secondary: "#999999",
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/logged",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "home",
                element: <Home />,
            },
            {
                path: "about-us",
                element: <AboutUs />,
            },
            {
                path: "sgc",
                element: <Sgc />,
            },
            {
                path: "upload-goals",
                element: <UploadGoals />,
            },
            {
                path: "goals-stats",
                element: <GoalsStats />,
            },
        ],
    },
]);

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <AnimatePresence mode="wait">
                    <RouterProvider router={router}>
                        <ScrollToTop />
                    </RouterProvider>
                </AnimatePresence>
            </CssBaseline>
        </ThemeProvider>
    </React.StrictMode>
);
