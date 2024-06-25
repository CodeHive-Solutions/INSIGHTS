import { useState } from "react";

// Material-UI
import { Dialog, DialogContent, DialogActions, Button, TextField, Typography, MenuItem, Box } from "@mui/material";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

// Custom components and assets
import { getApiUrl } from "../../assets/getApi";
import { handleError } from "../../assets/handleError";
const initialValues = {
    cedula: "",
    apellidos: "",
    nombres: "",
    estado_civil: "",
    hijos: "",
    personas_a_cargo: "",
    estrato: "",
    tel_fijo: "",
    celular: "",
    correo: "",
    contacto_emergencia: "",
    parentesco: "",
    tel_contacto: "",
    nivel_escolaridad: "",
    profesion: "",
    estudios_en_curso: "",
};

const personalFields = [
    {
        id: "cedula",
        label: "Cedula",
        name: "cedula",
        type: "text",
    },
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
    {
        id: "nivel_escolaridad",
        label: "Nivel de escolaridad",
        name: "nivel_escolaridad",
        type: "select",
        options: [
            { value: "PRIMARIA", label: "Primaria" },
            { value: "BACHILLER", label: "Bachiller" },
            { value: "TECNICO", label: "Tecnico" },
            { value: "TECNOLOGO", label: "Tecnologo" },
            { value: "AUXILIAR", label: "Auxiliar" },
            { value: "UNIVERSITARIO(A)", label: "Universitario" },
            { value: "PROFESIONAL", label: "Profesional" },
            { value: "ESPECIALIZACION", label: "Especializacion" },
        ],
    },
    {
        id: "profesion",
        label: "Profesión",
        name: "profesion",
        type: "text",
    },
    {
        id: "estudios_en_curso",
        label: "Estudios en curso",
        name: "estudios_en_curso",
        type: "text",
    },
];

const validationSchema = Yup.object().shape({
    cedula: Yup.string(),
    apellidos: Yup.string(),
    nombres: Yup.string(),
    estado_civil: Yup.string(),
    hijos: Yup.number().typeError("Numero de teléfono incorrecto"),
    personas_a_cargo: Yup.number().typeError("Numero incorrecto"),
    estrato: Yup.number().typeError("Numero incorrecto"),
    tel_fijo: Yup.number().typeError("Numero incorrecto"),
    celular: Yup.string(),
    correo: Yup.string().email("Correo inválido"),
    contacto_emergencia: Yup.string(),
    parentesco: Yup.string(),
    tel_contacto: Yup.number().typeError("Numero incorrecto"),
});

const MyAccountDialog = ({ open, onClose }) => {
    const cedula = JSON.parse(localStorage.getItem("cedula"));

    const getInitialValues = async () => {
        try {
            const response = await fetch(`${getApiUrl(true).apiUrl}personal-information/${cedula}`, {
                method: "GET",
            });

            await handleError(response);
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    useState(() => {
        getInitialValues();
    });

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

    const handleSave = () => {
        // Handle saving changes to the user's account
        console.log("Saving changes...");
        // Here you can make API calls to update the user's account details
        // Remember to handle errors and success messages accordingly
        onClose();
    };

    return (
        <Dialog fullWidth={true} maxWidth={"lg"} open={open} onClose={onClose}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                <Form>
                    <DialogContent>
                        <Typography variant="h2">Tu Cuenta</Typography>
                        <Typography variant="subtitle1">Completa y actualiza tu información personal</Typography>
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
    );
};

export default MyAccountDialog;
