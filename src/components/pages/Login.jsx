import { Box, Typography, Button, TextField, Link } from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import login_image from "../../images/ALE02974.webp";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import SnackbarAlert from "../common/SnackBarAlert";
import LinearProgress from "@mui/material/LinearProgress";
import apiRequest from "../../assets/apiRequest";
import { useCookies } from "react-cookie";

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Campo requerido"),
    password: Yup.string().required("Campo requerido"),
});

const FormikTextField = ({ label, type, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return <TextField sx={{ width: "330px" }} type={type} label={label} {...field} helperText={errorText} error={!!errorText} />;
};

const Login = () => {
    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [loadingBar, setLoadingBar] = useState(false);
    const [cookies, setCookie] = useCookies(["refresh-timer"]);

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
        setIsSubmitting(true);
        setLoadingBar(true);

        try {
            // Use the apiRequest function to make the API request
            // const response = await apiRequest("token/obtain/", "POST", JSON.stringify(values), "application/json");

            const response = await fetch("https://insights-api-dev.cyc-bpo.com/token/obtain/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
                credentials: "include",
            });

            setLoadingBar(false);
            setIsSubmitting(false);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            if (response.status === 200) {
                const expires = new Date();
                expires.setTime(expires.getTime() + 15 * 60 * 60 * 1000);
                setCookie("refresh-timer", "", { path: "/", expires });
                navigate("/logged/home");
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
                                Intranet
                            </Typography>

                            <FormikTextField type="text" name="username" label="Usuario" autoComplete="off" spellCheck={false} />

                            <FormikTextField name="password" label="Contraseña" type="password" autoComplete="off" spellCheck={false} />

                            <Box sx={{ width: "330px" }}>
                                <Link onClick={handleClick} sx={{ cursor: "pointer" }}>
                                    Has olvidado tu contraseña?{" "}
                                </Link>
                                <Collapse in={open}>
                                    <Alert severity="info">
                                        En caso de olvido o perdida de la contraseña contacte con tecnología para el restablecimiento de la misma en:{" "}
                                        <a href="https://helpdesk.cyc-bpo.com/" target="_blank" rel="noreferrer noopener">
                                            GLPI
                                        </a>
                                    </Alert>
                                </Collapse>
                            </Box>
                            <Button type="submit" variant="outlined" startIcon={<LoginOutlinedIcon />} disabled={isSubmitting}>
                                Iniciar Sesión
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
            {loadingBar && (
                <Box sx={{ width: "100vw", position: "absolute", zIndex: 1000 }}>
                    <LinearProgress variant="indeterminate" />
                </Box>
            )}
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </Box>
    );
};

export default Login;