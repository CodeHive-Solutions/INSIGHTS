import "./index.css";
import React, { useEffect } from "react";

// Libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from "react-router-dom";

// Material-UI
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom Components
import ErrorPage from "./components/pages/ErrorPage";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Blog from "./components/pages/Blog";
import Article from "./components/pages/Article";
import Root from "./components/container/root";
import About from "./components/pages/About";
import GoalsStats from "./components/pages/GoalsStats";
import Sgc from "./components/pages/Sgc";
import UploadFiles from "./components/pages/UploadFiles";
import EthicalLine from "./components/pages/EthicalLine";
import Quality from "./components/pages/Quality";
import Legal from "./components/pages/Legal";
import Vacancies from "./components/pages/Vacancies";
import VacanciesReferred from "./components/pages/VacanciesReferred";
import RiskEvents from "./components/pages/RiskEvents";
import Promotions from "./components/pages/Promotions";
import Payslips from "./components/pages/Payslips";
import MyPayslips from "./components/pages/MyPayslips";
import EmploymentCertification from "./components/pages/EmploymentCertification";
import InactivityDetector from "./components/shared/InactivityDetector";
import Vacations from "./components/pages/Vacations";
import PowerBI from "./components/pages/PowerBI";
import Points from "./components/pages/Points";
import { PersonalInformationProvider } from "./context/PersonalInformation";

Sentry.init({
    dsn: "https://5c6491f1c851a0f106e61adad4c4d46c@o4507664328359936.ingest.us.sentry.io/4507664339107840",
    integrations: [
        // See docs for support of different versions of variation of react router
        // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
        Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
        }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
});

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
        path: "test",
        element: <InactivityDetector />,
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
            {
                path: "vacancies-referred",
                element: <VacanciesReferred />,
            },
            {
                path: "risk-events",
                element: <RiskEvents />,
            },
            {
                path: "promotions",
                element: <Promotions />,
            },
            {
                path: "my-payslips",
                element: <MyPayslips />,
            },
            {
                path: "payslips",
                element: <Payslips />,
            },
            {
                path: "certifications",
                element: <EmploymentCertification />,
            },
            {
                path: "vacations",
                element: <Vacations />,
            },
            // {
            //     path: "points",
            //     element: <Points />,
            // },
            {
                path: "test",
                element: <PowerBI />,
            },
        ],
    },
]);

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <PersonalInformationProvider>
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <RouterProvider router={router} />
                </CssBaseline>
            </ThemeProvider>
        </React.StrictMode>
    </PersonalInformationProvider>
);
