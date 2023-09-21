import { useRouteError } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Navbar from "../common/NavBar";
import Footer from "../common/Footer";
import { useEffect } from "react";

function ErrorContent({ error }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: "25px",
            }}
        >
            <Typography variant="h3" gutterBottom>
                😔 Oops!
            </Typography>
            <Typography variant="subtitle1">Lo sentimos, se ha producido un error inesperado.</Typography>
            <Typography sx={{ textAlign: "center", width: "50%" }} variant="subtitle2">
                {error.statusText || error.message}
            </Typography>
        </Box>
    );
}

export default function ErrorPage({ isLogin }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const error = useRouteError();
    console.error(error);

    if (isLogin) {
        return <ErrorContent error={error} />;
    } else {
        return (
            <>
                <Navbar />
                <ErrorContent error={error} />
                <Footer />
            </>
        );
    }
}
