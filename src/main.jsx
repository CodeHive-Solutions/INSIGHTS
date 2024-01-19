import "./index.css";
import React from "react";
import ErrorPage from "./components/pages/ErrorPage";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Blog from "./components/pages/Blog";
import Article from "./components/pages/Article";
import Root from "./components/container/root";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import About from "./components/pages/About";
import GoalsStats from "./components/pages/GoalsStats";
import Sgc from "./components/pages/Sgc";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useOutlet } from "react-router-dom";
import ImageUploader from "./components/Test";
import UploadFiles from "./components/pages/UploadFiles";
import EthicalLine from "./components/pages/EthicalLine";
import BasicDocument from "./components/shared/GoalsPDF";
import Quality from "./components/pages/Quality";
import Legal from "./components/pages/Legal";
import Vacancies from "./components/pages/Vacancies";
const theme = createTheme({
    typography: {
        fontFamily: [
            "Poppins",
            "Inter",
            "Montserrat",
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
        errorElement: <ErrorPage isLogin={true} />,
    },
    {
        path: "ethical-line",
        element: <EthicalLine />,
    },
    {
        path: "goal-pdf",
        element: <BasicDocument />,
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
                element: <About />,
            },
            {
                path: "sgc",
                element: <Sgc />,
            },
            {
                path: "blog",
                element: <Blog />,
            },
            {
                path: "blog/article/:articleId",
                element: <Article />,
            },
            {
                path: "vacancies",
                element: <Vacancies />,
            },
            {
                path: "upload-files",
                element: <UploadFiles />,
            },
            {
                path: "goals-stats",
                element: <GoalsStats />,
            },
            {
                path: "quality",
                element: <Quality />,
            },
            {
                path: "legal",
                element: <Legal />,
            },
        ],
    },
]);

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

function AnimatedRoutes() {
    const outlet = useOutlet();
    const key = outlet ? outlet.key : "";

    return (
        <motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {outlet}
        </motion.div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <RouterProvider router={router}>
                    <AnimatePresence mode="wait">
                        <AnimatedRoutes />
                    </AnimatePresence>
                </RouterProvider>
            </CssBaseline>
        </ThemeProvider>
    </React.StrictMode>
);
