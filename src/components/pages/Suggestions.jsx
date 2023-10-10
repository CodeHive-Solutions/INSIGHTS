import React, { useState } from "react";
import { Container, Box, Typography, TextField, MenuItem, Button, LinearProgress } from "@mui/material";
import { Formik, Form, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import SendIcon from "@mui/icons-material/Send";
import SnackbarAlert from "../common/SnackBarAlert";

const areas = [
    { value: "Presidencia - Pablo César Castañeda Camacho", label: "Presidencia - Pablo César Castañeda Camacho" },
    { value: "Gerencia General - Jose Fernando Duran", label: "Gerencia General - Jose Fernando Duran" },
    { value: "Gerencia de Cuentas - Nelson Acevedo", label: "Gerencia de Cuentas - Nelson Acevedo" },
    { value: "Gerencia de Cuenta Banco Falabella - Adriana Páez", label: "Gerencia de Cuenta Banco Falabella - Adriana Páez" },
    { value: "Gerencia de Cuenta Claro - Adriana Barrera", label: "Gerencia de Cuenta Claro - Adriana Barrera" },
    { value: "Gerencia de Planeacion - Angela Duran", label: "Gerencia de Planeacion - Angela Duran" },
    { value: "Gerencia de Tecnología - Javier Torres", label: "Gerencia de Tecnología - Javier Torres" },
    { value: "Gerencia SGSI Control interno - Mario Ernesto Giron", label: "Gerencia SGSI Control interno - Mario Ernesto Giron" },
    { value: "Gerencia de Operaciones - Angela Duran", label: "Gerencia de Operaciones - Angela Duran" },
    { value: "Gerencia Legal y de Riesgo - César Garzón", label: "Gerencia Legal y de Riesgo - César Garzón" },
    { value: "Gerencia Administrativa - Melida Sandoval", label: "Gerencia Administrativa - Melida Sandoval" },
    { value: "Gerencia de Gestión Humana - Jeanneth Pinzón", label: "Gerencia de Gestión Humana - Jeanneth Pinzón" },
    { value: "Gerencia Contable - Melida Sandoval", label: "Gerencia Contable - Melida Sandoval" },
    { value: "Dinerum - Opticoom - Lila Marcela Avila Tordecilla", label: "Dinerum - Opticoom - Lila Marcela Avila Tordecilla" },
];

const motivos = [
    { value: "Felicitación", label: "Felicitación" },
    { value: "Queja", label: "Queja" },
    { value: "Sugerencia", label: "Sugerencia" },
    { value: "Otro", label: "Otro" },
];

const validationSchema = Yup.object().shape({
    area: Yup.string().required("Campo requerido"),
    motivo: Yup.string().required("Campo requerido"),
    mensaje: Yup.string().required("Campo requerido"),
});

const Suggestions = () => {
    const [loadingBar, setLoadingBar] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();

    const handleCloseSnack = () => setOpenSnack(false);
    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const handleSubmit = async (values) => {
        console.log(values);
        setLoadingBar(true);
        showSnack("success", "Sugerencia enviada correctamente");

        try {
            const response = await fetch("https://insights-api-dev.cyc-bpo.com/suggestions/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
                credentials: "include",
            });

            setLoadingBar(false);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            if (response.status === 200) {
            }
        } catch (error) {
            console.error(error);

            if (error.message === "Unable to log in with provided credentials." || error.message === "No active account found with the given credentials") {
                showSnack("error", "No se puede iniciar sesión con las credenciales proporcionadas.");
            } else {
                console.log(error.message);
                showSnack("error", error.message);
            }

            setLoadingBar(false);
        }
    };

    const FormikTextField = ({ label, type, options, multiline, rows, width, ...props }) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : "";
        if (type === "select") {
            return (
                <TextField sx={{ width: "330px" }} defaultValue="" select type={type} label={label} {...field} helperText={errorText} error={!!errorText}>
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );
        } else {
            return <TextField sx={{ width: width }} multiline={multiline} rows={rows} type={type} label={label} {...field} helperText={errorText} error={!!errorText} />;
        }
    };

    return (
        <Container sx={{ height: "max-content", mt: "5rem" }}>
            <Typography variant={"h4"} sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }}>
                Sugerencias
            </Typography>
            <Formik initialValues={{ area: "", motivo: "", mensaje: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                <Form>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <FormikTextField type="select" options={areas} name="area" label="Area" autoComplete="off" spellCheck={false} />

                        <FormikTextField type="select" options={motivos} name="motivo" label="Motivo" autoComplete="off" spellCheck={false} />

                        <FormikTextField width="100%" type="text" multiline={true} rows={8} name="mensaje" label="Mensaje" autoComplete="off" spellCheck={false} />
                        <Button disabled={loadingBar} type="submit" sx={{ width: "max-content" }} variant="outlined" endIcon={<SendIcon />}>
                            Enviar
                        </Button>
                    </Box>
                </Form>
            </Formik>
            {loadingBar && (
                <Box sx={{ width: "100%", position: "absolute", zIndex: 1000, top: 0, left: 0 }}>
                    <LinearProgress variant="indeterminate" />
                </Box>
            )}
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </Container>
    );
};

export default Suggestions;
