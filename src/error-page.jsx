import { useRouteError } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: "25px",
                backgroundColor: "#131313",
            }}
        >
            <Typography variant="h3" color="white" gutterBottom>
                😔 Oops!
            </Typography>
            <Typography variant="subtitle1" color="white">
                Lo sentimos, se ha producido un error inesperado.
            </Typography>
            <Typography variant="subtitle2" color="white">
                <i>{error.statusText || error.message}</i>
            </Typography>
        </Box>
    );
}
