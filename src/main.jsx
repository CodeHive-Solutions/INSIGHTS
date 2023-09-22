import "./index.css";
import React from "react";
import ErrorPage from "./components/pages/ErrorPage";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Root from "./components/container/root";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import AboutUs from "./components/pages/About";
import UploadGoals from "./components/pages/UploadGoals";
import GoalsStats from "./components/pages/GoalsStats";
import Sgc from "./components/pages/Sgc";
import "./index.css";
import Test from "./components/pages/Test";

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

const routes = [
    {
        path: "/",
        element: <Login />,
        errorElement: <ErrorPage isLogin={true} />,
    },
    {
        path: "test",
        element: <Test />,
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
            {
                path: "blog",
                element: <ErrorPage />,
            },
        ],
    },
];

const router = createBrowserRouter([]);

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <RouterProvider router={router} />
            </CssBaseline>
        </ThemeProvider>
    </React.StrictMode>
);
