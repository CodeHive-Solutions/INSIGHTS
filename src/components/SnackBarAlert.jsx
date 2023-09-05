import { React, useState, createContext } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackbarAlert = ({ message, severity, handleClickSnack }) => {
    const [openSnack, setOpenSnack] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnack(false);
    };

    // Use the handleClickSnack prop to trigger the function
    handleClickSnack();

    return (
        <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarAlert;
