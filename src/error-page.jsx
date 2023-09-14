import { useRouteError } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <>
            <Navbar />
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
            <Footer />
        </>
    );
}
