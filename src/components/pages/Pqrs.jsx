import React, { useState } from "react";
import { Container, Box, Typography, TextField, MenuItem, Button, LinearProgress } from "@mui/material";
import { Formik, Form, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import SendIcon from "@mui/icons-material/Send";
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";

const areas = [
    { value: "CARREÑO DAZA - JUAN SEBASTIAN", label: "CARREÑO DAZA JUAN SEBASTIAN" },
    { value: "EJECUTIVO", label: "Castañeda Camacho Pablo Cesar - Presidente" },
    { value: "GERENCIA GENERAL", label: "César Alberto Garzón Navas - Gerente General" },
    { value: "GERENCIA DE RIESGO Y CONTROL INTERNO", label: "Mario Ernesto Girón Salazar - Gerente Riesgo y Control Interno" },
    { value: "GERENCIA GESTIÓN HUMANA", label: "Jeanneth Pinzón - Gerente Gestión Humana" },
    { value: "GERENCIA DE PLANEACIÓN", label: "Angela Maria Durán Gutierrez - Gerente Planeación" },
    { value: "GERENCIA ADMINISTRATIVA", label: "Melida Sandoval Cabra - Gerente Administrativa" },
    { value: "GERENCIA DE LEGAL Y RIESGO", label: "Adriana Nataly Páez Castiblanco - Gerente Operaciones" },
    { value: "GERENCIA DE OPERACIONES", label: "Diego Fernando Gonzalez - Gerente de Legal y Riesgo" },
    { value: "GERENCIA DE MERCADEO", label: "Héctor Gabriel Sotelo - Gerente de Operaciones Ventas" },
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
    description: Yup.string().required("Campo requerido"),
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
        setLoadingBar(true);

        try {
            const response = await fetch(`${getApiUrl()}pqrs/complaints/`, {
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
                console.error(error.message);
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
        <Container sx={{ height: "max-content", my: "5rem" }}>
            <Box sx={{ pb: "1rem" }}>
                <Typography variant={"h4"} sx={{ textAlign: "center", pb: "15px", color: "primary.main" }}>
                    PQRS
                </Typography>
                <Typography variant={"body"}>
                    En esta sección puedes enviar un mensaje a alguna de las Gerencias de la Compañía según tus intereses. De manera muy respetuosa puedes redactar un
                    mensaje dando a conocer tus inconformidades, inconvenientes, sugerencias o felicitaciones a la Gerencia a la cual desees enviar el mensaje.
                    <br />
                    <br />
                    Ten en cuenta que el mensaje que envíes sólo lo conocerás tú y el Gerente del área a la que lo envíes. Procura redactar con prudencia y buena
                    ortografía para que tu mensaje sea totalmente legible.
                </Typography>
            </Box>
            <Formik initialValues={{ name: "", motivo: "", description: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {}
                <Form>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <FormikTextField type="select" options={areas} name="area" label="Area" autoComplete="off" spellCheck={false} />
gh
                        <FormikTextField type="select" options={motivos} name="motivo" label="Motivo" autoComplete="off" spellCheck={false} />

                        <FormikTextField width="100%" type="text" multiline={true} rows={8} name="description" label="Mensaje" autoComplete="off" spellCheck={false} />
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
