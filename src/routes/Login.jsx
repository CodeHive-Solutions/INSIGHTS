import { Box, Typography, Button, TextField, Link } from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import login_image from "../images/ALE02974.webp";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { React, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import SnackbarAlert from "../components/SnackBarAlert";

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Requerido"),
    password: Yup.string().required("Requerido"),
});

const SnackContext = createContext();

const FormikTextField = ({ label, type, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return <TextField sx={{ width: "330px" }} type={type} label={label} {...field} helperText={errorText} error={!!errorText} />;
};

const Login = () => {
    const [open, setOpen] = React.useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();

    const handleClickSnack = () => setOpenSnack(true);

    const handleSubmit = async (values) => {
        setIsSubmitting(true); // Set isSubmitting to true when submitting the form

        try {
            const response = await fetch("https://insights-api-dev.cyc-bpo.com/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            setIsSubmitting(false);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (response.status === 200) {
                handleClickSnack();
                setMessage("Bienvenido a la intranet de C&C SERVICES S.A.S");
                // navigate("/loged/home", { replace: true });
            } else {
                console.error(response.status + response.statusText);
                setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + response.statusText, true);
            }
        } catch (error) {
            setShowSnackAlert("error", "Por favor envia este error a desarrollo: " + error, true);
        }
    };

    const handleClick = () => setOpen(!open);

    return (
        <Box sx={{ display: "flex" }}>
            <Box
                sx={{
                    height: "100vh",
                    width: "65%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${login_image})`,
                    clipPath: "polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)",
                }}
            ></Box>
            <Box
                sx={{
                    width: "35%",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        width: "100%",
                        height: "30%",
                        paddingRight: "15px",
                    }}
                >
                    <Typography variant="subtitle2">INSIGHTS</Typography>
                </Box>
                <Formik initialValues={{ username: "", password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "15px",
                            }}
                        >
                            <Typography sx={{ fontWeight: 500 }} variant="h4">
                                Iniciar Sesion
                            </Typography>

                            <FormikTextField type="text" name="username" label="Usuario" autoComplete="off" spellCheck={false} />

                            <FormikTextField name="password" label="Contraseña" type="password" autoComplete="off" spellCheck={false} />

                            <Box sx={{ width: "330px" }}>
                                <Link onClick={handleClick} sx={{ cursor: "pointer" }}>
                                    Has olvidado tu contraseña?{" "}
                                </Link>
                                <Collapse in={open}>
                                    <Alert severity="info">
                                        En caso de olvido o perdida de la contraseña contacte con tecnologia para el restablecimiento de la misma en:{" "}
                                        <a href="https://helpdesk.cyc-bpo.com/" target="_blank" rel="noreferrer noopener">
                                            GLPI
                                        </a>
                                    </Alert>
                                </Collapse>
                            </Box>
                            <Button type="submit" variant="outlined" startIcon={<LoginOutlinedIcon />} disabled={isSubmitting}>
                                Iniciar Sesion
                            </Button>
                        </Box>
                    </Form>
                </Formik>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        width: "100%",
                        height: "35%",
                        paddingRight: "15px",
                    }}
                >
                    <Typography variant="subtitle2">C&C SERVICES © - Bogotá D.C. / Colombia.</Typography>
                </Box>
            </Box>
            <SnackContext.Provider value={{ openSnack, setOpenSnack }}>
                <button onClick={() => setOpenSnack(true)}>Click me</button>
                <SnackbarAlert />
            </SnackContext.Provider>
        </Box>
    );
};

export default Login;
