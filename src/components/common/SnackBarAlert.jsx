import { React, useState, createContext } from "react";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

const SnackbarAlert = ({ message, severity, openSnack, closeSnack }) => {
    return (
        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={openSnack} autoHideDuration={6000} onClose={closeSnack}>
            <Alert onClose={closeSnack} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarAlert;
