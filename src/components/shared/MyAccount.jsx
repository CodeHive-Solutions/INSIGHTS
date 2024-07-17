import { useState } from "react";

// Material-UI
import { Dialog, DialogContent, DialogActions, Button, TextField, Typography, MenuItem, Box, DialogContentText, LinearProgress, Fade } from "@mui/material";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

// Custom components and assets
import { getApiUrl } from "../../assets/getApi";
import { handleError } from "../../assets/handleError";
import SnackbarAlert from "../common/SnackBarAlert";

const personalFields = [
    {
        id: "estado_civil",
        label: "Estado civil",
        name: "estado_civil",
        type: "select",
        options: [
            { value: "CASADO(A)", label: "Casado(a)" },
            { value: "DIVORCIADO(A)", label: "Divorciado(a)" },
            { value: "SEPARADO(A)", label: "Separado(a)" },
            { value: "SOLTERO(A)", label: "Soltero(a)" },
            { value: "UNION LIBRE", label: "Union Libre" },
            { value: "VIUDO(A)", label: "Viudo(a)" },
        ],
    },
    {
        id: "hijos",
        label: "Hijos",
        name: "hijos",
        type: "select",
        options: [
            { value: 0, label: "0" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
        ],
    },
    {
        id: "personas_a_cargo",
        label: "Personas a cargo",
        name: "personas_a_cargo",
        type: "select",
        options: [
            { value: 0, label: "0" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
        ],
    },
    {
        id: "tel_fijo",
        label: "Teléfono fijo",
        name: "tel_fijo",
        type: "text",
    },
    { id: "celular", label: "Celular", name: "celular", type: "text" },
    { id: "correo", label: "Correo", name: "correo", type: "email" },
    {
        id: "contacto_emergencia",
        label: "Contacto de emergencia",
        name: "contacto_emergencia",
        type: "text",
    },
    {
        id: "parentesco",
        label: "Parentesco del contacto de emergencia",
        name: "parentesco",
        type: "select",
        options: [
            { value: "", label: "Seleccione una opción" },
            { value: "ABUELO(A)", label: "Abuelo(a)" },
            { value: "AMIGO(A)", label: "Amigo(a)" },
            { value: "ESPOSO(A)", label: "Esposo(a)" },
            { value: "FAMILIAR", label: "Familiar" },
            { value: "HERMANO(A)", label: "Hermano(a)" },
            { value: "HIJO(A)", label: "Hijo(a)" },
            { value: "MADRE", label: "Madre" },
            { value: "PADRE", label: "Padre" },
            { value: "PAREJA", label: "Pareja" },
            { value: "PRIMO(A)", label: "Primo(a)" },
            { value: "TIO(A)", label: "Tio(a)" },
        ],
    },
    {
        id: "tel_contacto",
        label: "Teléfono de contacto de emergencia",
        name: "tel_contacto",
        type: "text",
    },
];

const validationSchema = Yup.object().shape({
    estado_civil: Yup.string().required("Campo requerido").required("Campo requerido"),
    hijos: Yup.number().typeError("Numero de teléfono incorrecto").required("Campo requerido"),
    personas_a_cargo: Yup.number().typeError("Numero incorrecto").required("Campo requerido"),
    tel_fijo: Yup.string().matches(/^[0-9]+$/, "Numero de teléfono incorrecto"),
    celular: Yup.string().matches(/^[0-9]+$/, "Numero de celular incorrecto"),
    correo: Yup.string().email("Correo inválido").required("Campo requerido"),
    contacto_emergencia: Yup.string().required("Campo requerido"),
    parentesco: Yup.string().required("Campo requerido"),
    tel_contacto: Yup.string().matches(/^[0-9]+$/, "Numero de contacto incorrecto"),
});

const MyAccountDialog = ({ open, onClose }) => {
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [initialValues, setInitialValues] = useState({});
    const [loadingBar, setLoadingBar] = useState(false);

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

    const showSnack = (severity, message) => {
        setMessage(message);
        setSeverity(severity);
        setOpenSnack(true);
    };

    const getInitialValues = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}users/get-profile/`, {
                method: "GET",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setInitialValues(data.data);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    useState(() => {
        getInitialValues();
    }, [open]);

    const MyTextFields = () => {
        return personalFields.map((myField) => {
            const [field, meta] = useField(myField);
            const errorText = meta.error && meta.touched ? meta.error : "";
            return (
                <TextField
                    key={myField.id}
                    margin="normal"
                    label={myField.label}
                    type={myField.type}
                    select={myField.type === "select"}
                    helperText={errorText}
                    error={!!errorText}
                    {...field}
                >
                    {myField.options &&
                        myField.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>
            );
        });
    };

    const handleSave = async (values) => {
        setLoadingBar(true);
        try {
            const response = await fetch(`${getApiUrl().apiUrl}users/update-profile/`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                showSnack("success", "Información actualizada");
                onClose();
                getInitialValues();
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        } finally {
            setLoadingBar(false);
        }
    };

    return (
        <>
            <Fade in={loadingBar}>
                <LinearProgress sx={{ zIndex: "1301" }} color="secondary" />
            </Fade>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
            <Dialog open={open} onClose={onClose}>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSave}>
                    <Form>
                        <DialogContent>
                            <Typography variant="h4">Tu Cuenta</Typography>
                            <DialogContentText sx={{ marginBottom: "1rem" }} id="alert-dialog-slide-description">
                                Completa y actualiza tu información personal
                            </DialogContentText>
                            <Box
                                sx={{
                                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                                }}
                            >
                                <MyTextFields />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button variant="contained" type="submit">
                                Actualizar
                            </Button>
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
        </>
    );
};

export default MyAccountDialog;
