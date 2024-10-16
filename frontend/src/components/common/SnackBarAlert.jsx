// Material-UI
import { Snackbar, Alert, Button } from '@mui/material';

const SnackbarAlert = ({
    message,
    severity,
    openSnack,
    closeSnack,
    action,
}) => {
    if (!action) {
        return (
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnack}
                onClose={closeSnack}
            >
                <Alert onClose={closeSnack} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        );
    } else {
        return (
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnack}
                onClose={closeSnack}
            >
                <Alert
                    onClose={closeSnack}
                    severity={severity}
                    action={
                        <Button color="inherit" size="small">
                            Aceptar
                        </Button>
                    }
                >
                    {message}
                </Alert>
            </Snackbar>
        );
    }
};

export default SnackbarAlert;
