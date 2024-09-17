import { useState, useEffect } from 'react';

// Libraries
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import * as Sentry from '@sentry/react';

// Custom Components
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi.js';

// Material-UI
import {
    Box,
    Typography,
    Button,
    TextField,
    Link,
    Alert,
    Collapse,
    LinearProgress,
} from '@mui/material';

// Icons
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import login_image from '../../images/login/new-login-image.jpg';

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Campo requerido'),
    password: Yup.string().required('Campo requerido'),
});

const FormikTextField = ({ label, type, disabled, autoComplete, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    return (
        <TextField
            disabled={disabled}
            sx={{ width: '330px' }}
            type={type}
            label={label}
            {...field}
            helperText={errorText}
            autoComplete={autoComplete}
            error={!!errorText}
        />
    );
};

const Login = () => {
    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [loadingBar, setLoadingBar] = useState(false);
    const location = useLocation();
    const showAlert = location.state?.showAlert;
    const lastLocationPath = location.state?.lastLocation
        ? new URL(location.state?.lastLocation).pathname
        : null;
    const [lastLocation, setLastLocation] = useState(null);

    // Use Effect Hook to update localStorage when items state changes
    useEffect(() => {
        Sentry.init({ environment: getApiUrl().environment });
        let refreshTimer = JSON.parse(localStorage.getItem('refresh-timer-ls'));

        if (
            refreshTimer !== null &&
            refreshTimer.expiry > new Date().getTime()
        ) {
            navigate('/logged/home');
        }
    }, []);

    useEffect(() => {
        if (showAlert) {
            // Show the alert here
            showSnack(
                'info',
                'Has sido desconectado por inactividad. Por favor, inicia sesión nuevamente.'
            );
            // Clear the showAlert state
            setLastLocation(lastLocationPath);
            navigate('.', {
                state: {
                    ...location.state,
                    showAlert: false,
                    lastLocation: null,
                },
                replace: true,
            });
        }
    }, [showAlert, navigate, location, lastLocation]);

    const handleCloseSnack = () => setOpenSnack(false);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        setLoadingBar(true);

        try {
            const response = await fetch(`${getApiUrl().apiUrl}token/obtain/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
                credentials: 'include',
            });

            setIsSubmitting(false);
            setLoadingBar(false);

            const data = await response.json();

            if (!response.ok) {
                // Check if the response contains the expected error structure
                if (
                    response.status === 400 &&
                    data &&
                    data.non_field_errors &&
                    data.non_field_errors.length > 0
                ) {
                    // If the error structure is as expected, throw the first error message
                    setOpenCedula(true);
                    throw new Error(
                        'Tu usuario esta siendo creado, por favor intenta mas tarde.'
                    );
                } else if (
                    response.status === 401 &&
                    data &&
                    data.detail &&
                    data.detail.length > 0
                ) {
                    showSnack(
                        'error',
                        'No se puede iniciar sesión con las credenciales proporcionadas.'
                    );
                } else {
                    // If the error structure is not as expected, throw a generic error
                    throw new Error(
                        'Ha ocurrido un error. Por favor, inténtelo de nuevo.'
                    );
                }
            }

            if (response.status === 200) {
                // Set the item in localStorage
                localStorage.setItem(
                    'refresh-timer-ls',
                    JSON.stringify({
                        expiry: new Date().getTime() + 15 * 60 * 60 * 1000, // 24 hours from now
                    })
                );
                localStorage?.setItem(
                    'permissions',
                    JSON.stringify(data.permissions)
                );
                localStorage?.setItem('cedula', JSON.stringify(data.cedula));
                localStorage?.setItem('cargo', JSON.stringify(data.cargo));
                localStorage?.setItem('email', JSON.stringify(data.email));
                localStorage?.setItem('rango', JSON.stringify(data.rango));
                Sentry.setUser({
                    id: data.cedula,
                    email: data.email,
                    username: values.username,
                });
                if (lastLocation) {
                    navigate(lastLocation, { replace: true });
                } else {
                    navigate('/logged/home');
                }
            }
        } catch (error) {
            if (
                error.message ===
                'Tu usuario esta siendo creado, por favor intenta mas tarde.'
            ) {
                showSnack('info', error.message);
            } else {
                console.error(error);
                if (
                    error.message ===
                        'Unable to log in with provided credentials.' ||
                    error.message ===
                        'No active account found with the given credentials'
                ) {
                    showSnack(
                        'error',
                        'No se puede iniciar sesión con las credenciales proporcionadas.'
                    );
                } else {
                    console.error(error.message);
                    showSnack('error', error.message);
                }
            }
            setIsSubmitting(false);
            setLoadingBar(false);
        }
    };

    const handleClick = () => setOpen(!open);

    const ethicalLine = () => {
        navigate('ethical-line');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                sx={{
                    height: '100vh',
                    width: '65%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${login_image})`,
                    clipPath: 'polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)',
                }}
            ></Box>
            <Box
                sx={{
                    width: '35%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        width: '100%',
                        height: '30%',
                        paddingRight: '15px',
                    }}
                ></Box>
                <Formik
                    initialValues={{ username: '', password: '', cedula: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '15px',
                            }}
                        >
                            <Typography
                                sx={{ fontFamily: 'Montserrat' }}
                                variant="h3"
                            >
                                Intranet
                            </Typography>

                            <FormikTextField
                                type="text"
                                name="username"
                                label="Usuario de Windows"
                                autoComplete="on"
                                spellCheck={false}
                            />

                            <FormikTextField
                                name="password"
                                label="Contraseña de Windows"
                                type="password"
                                autoComplete="off"
                                spellCheck={false}
                            />

                            <Box sx={{ width: '330px' }}>
                                <Link
                                    onClick={handleClick}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    Has olvidado tu contraseña?{' '}
                                </Link>
                                <Collapse in={open}>
                                    <Alert severity="info">
                                        En caso de olvido o perdida de la
                                        contraseña contacta con tu jefe a cargo
                                        para que te ayude subiendo el ticket
                                        para el restablecimiento de la
                                        contraseña.
                                    </Alert>
                                </Collapse>
                            </Box>
                            <Button
                                sx={{ fontFamily: 'Montserrat' }}
                                type="submit"
                                variant="contained"
                                startIcon={<LoginOutlinedIcon />}
                                disabled={isSubmitting}
                            >
                                Iniciar Sesión
                            </Button>
                            <Button
                                onClick={ethicalLine}
                                sx={{ fontFamily: 'Montserrat' }}
                                type="button"
                                variant="outlined"
                                startIcon={<Diversity3Icon />}
                            >
                                Linea ética
                            </Button>
                        </Box>
                    </Form>
                </Formik>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        width: '100%',
                        height: '35%',
                        paddingRight: '15px',
                    }}
                >
                    <Typography variant="subtitle2">
                        C&C SERVICES © - Bogotá D.C. / Colombia.
                    </Typography>
                </Box>
            </Box>
            {loadingBar && (
                <Box
                    sx={{ width: '100vw', position: 'absolute', zIndex: 1000 }}
                >
                    <LinearProgress variant="indeterminate" />
                </Box>
            )}
            <SnackbarAlert
                message={message}
                severity={severity}
                openSnack={openSnack}
                closeSnack={handleCloseSnack}
            />
        </Box>
    );
};

export default Login;
