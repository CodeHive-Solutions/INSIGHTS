import "./index.css";
import React from "react";

// Libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useOutlet } from "react-router-dom";

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
import BasicDocument from "./components/shared/GoalsPDF";
import Quality from "./components/pages/Quality";
import Legal from "./components/pages/Legal";
import Vacancies from "./components/pages/Vacancies";
import VacanciesReferred from "./components/pages/VacanciesReferred";
import RiskEvents from "./components/pages/RiskEvents";
import Promotions from "./components/pages/Promotions";
import Payslips from "./components/pages/Payslips";
import MyPayslips from "./components/pages/MyPayslips";
import SwiperSlider from "./components/shared/SwiperSlider";
import EmploymentCertification from "./components/pages/EmploymentCertification";
import ImageMagnifier from "./components/pages/ImageMagnifier";
import InactivityDetector from "./components/shared/InactivityDetector";
import Pqrs from "./components/pages/Pqrs";
import Vacations from "./components/pages/Vacations";
import PowerBI from "./components/pages/PowerBI";
import { getApiUrl } from "./assets/getApi";
import { PersonalInformationProvider } from "./context/PersonalInformation";
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://74b2a60beb60fb19bce3c46c0a1f1b78@o4507662809432064.ingest.us.sentry.io/4507662981070848",
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replayg
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
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
        path: "goal-pdf",
        element: <BasicDocument />,
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
            {
                path: "test",
                element: <PowerBI />,
            },
            // getApiUrl().environment === "development"
            //     ? {
            //           path: "pqrs",
            //           element: <Pqrs />,
            //       }
            //     : null,
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
    <PersonalInformationProvider>
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
    </PersonalInformationProvider>
);
