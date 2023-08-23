import "./index.css";
import React from "react";
import ErrorPage from "./error-page";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Root from "./routes/root";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import AboutUs from "./routes/AboutUs";

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

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <Login />,
//         errorElement: <ErrorPage />,
//     },
//     {
//         path: "/loged",
//         element: <Root />,
//         errorElement: <ErrorPage />,
//         children: [
//             {
//                 path: "home",
//                 element: <Home />,
//             },
//             {
//                 path: "about-us",
//                 element: <AboutUs />,
//             },
//         ],
//     },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Router>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/loged/*" element={<Root />}>
                            <Route path="home" element={<Home />} />
                            <Route path="about-us" element={<AboutUs />} />
                        </Route>
                    </Routes>
                </Router>
            </CssBaseline>
        </ThemeProvider>
    </React.StrictMode>
);
