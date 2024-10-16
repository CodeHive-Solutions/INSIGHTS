import { useState } from 'react';

// Libraries
import { Formik, Form, useField, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

// Custom Components
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';

// Media
import ethicalLineBackground from '../../images/ethical-line/ethical-line-background.jpg';
import logoCYC from '../../images/cyc-logos/logo-navbar.webp';

// Material-UI
import {
    Container,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    LinearProgress,
    Collapse,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@mui/material';

// Icons
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const complaintType = [
    { value: 'Fraude y Engaño', label: 'Fraude y Engaño' },
    { value: 'Acoso y Discriminación', label: 'Acoso y Discriminación' },
    {
        value: 'Incumplimiento de Normativas',
        label: 'Incumplimiento de Normativas',
    },
    {
        value: 'Divulgación Inapropiada de Información',
        label: 'Divulgación Inapropiada de Información',
    },
    {
        value: 'Ignorar el Canal de Denuncia Ética',
        label: 'Ignorar el Canal de Denuncia Ética',
    },
    { value: 'Falta de Transparencia', label: 'Falta de Transparencia' },
    { value: 'Conflicto de Intereses', label: 'Conflicto de Intereses' },
];

const baseValidationSchema = Yup.object().shape({
    complaint: Yup.string().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
    radio: Yup.string().required('Campo requerido'),
    contact: Yup.string().test(
        'is-required-if-si',
        'Campo requerido',
        function (value) {
            const { radio } = this.parent; // Access the radio value
            if (radio === 'si') {
                return !!value; // Check if value is present
            }
            return true; // Not required if radio is not 'si'
        }
    ),
});

const baseInitialValues = {
    complaint: '',
    description: '',
    radio: '',
    contact: '',
};

const EthicalLine = () => {
    const [loadingBar, setLoadingBar] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [collapse, setCollapse] = useState(false);
    const navigate = useNavigate();

    const FormikError = ({ name }) => {
        const [meta] = useField(name);
        const errorText = meta.error && meta.touched ? meta.error : '';
        return errorText ? (
            <FormHelperText error>{errorText}</FormHelperText>
        ) : null;
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleSubmit = async (values) => {
        let { contact, ...rest } = values;

        // Remove the contact field if it's empty
        if (contact === '') {
            contact = undefined;
        } else {
            rest = { ...rest, contact };
        }

        const descriptionValue = values.description.replace(/\n/g, '<br>');
        rest = { ...rest, description: descriptionValue };

        setLoadingBar(true);
        showSnack('success', 'Sugerencia enviada correctamente');

        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}services/send-ethical-line/`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rest),
                    credentials: 'include',
                }
            );

            setLoadingBar(false);

            await handleError(response, showSnack);

            if (response.status === 200) {
                showSnack('success', 'Sugerencia enviada correctamente');
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
            setLoadingBar(false);
        }
    };

    const FormikTextField = ({
        label,
        type,
        options,
        multiline,
        rows,
        width,
        ...props
    }) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : '';
        if (type === 'select') {
            return (
                <TextField
                    sx={{ width: '330px' }}
                    defaultValue=""
                    select
                    type={type}
                    label={label}
                    {...field}
                    helperText={errorText}
                    error={!!errorText}
                >
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );
        } else {
            return (
                <TextField
                    sx={{ width: width }}
                    multiline={multiline}
                    rows={rows}
                    type={type}
                    label={label}
                    {...field}
                    helperText={errorText}
                    error={!!errorText}
                />
            );
        }
    };

    const closeCollapse = () => {
        setCollapse(false);
    };

    const openCollapse = () => {
        setCollapse(true);
    };

    return (
        <>
            <Box
                className="waveWrapper"
                sx={{
                    width: '100%',
                    height: '50vh',
                    backgroundImage: `url(${ethicalLineBackground})`,
                    backgroundSize: 'cover',
                    backgroundColor: '#f0f0f0',
                    padding: '20px',
                }}
            >
                <Typography
                    variant={'h1'}
                    sx={{
                        textAlign: 'center',
                        pb: '15px',
                        color: 'white',
                        pt: '6rem',
                    }}
                >
                    Linea Ética
                </Typography>
                <Box className="wave wave1"></Box>
                <Box className="wave wave2"></Box>
                <Box className="wave wave3"></Box>
                <Box className="wave wave4"></Box>
            </Box>
            <Container sx={{ height: 'max-content', py: '5rem' }}>
                <Box sx={{ color: 'primary.main' }}>
                    <Button
                        onClick={() => navigate('/')}
                        startIcon={<ArrowBackIosNewIcon />}
                    >
                        Volver
                    </Button>
                </Box>
                <Box
                    sx={{
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: '2rem',
                    }}
                >
                    <img src={logoCYC} alt="imagen-logo-cyc" width={200} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        flexDirection: 'column',
                        height: 'max-content',
                        mb: '2rem',
                        p: '0',
                    }}
                >
                    <Typography variant="body1">
                        La línea ética es un canal de comunicación confidencial
                        que permite a los empleados reportar de manera anónima
                        cualquier conducta que consideren contraria a los
                        valores y principios de la empresa.
                    </Typography>
                    <Typography variant="h4">Objetivo</Typography>
                    <Typography variant="body1">
                        El objetivo de la línea ética es promover un ambiente de
                        trabajo seguro y respetuoso, en el que todos los
                        empleados se sientan cómodos para denunciar cualquier
                        situación que pueda poner en riesgo la integridad de las
                        personas, los recursos de la empresa o el cumplimiento
                        de sus obligaciones legales.
                    </Typography>
                    <Typography variant="h4">¿Qué puedes reportar?</Typography>
                    <ul>
                        <li>Fraude y Engaño</li>
                        <li>Acoso y Discriminación</li>
                        <li>Incumplimiento de Normativas</li>
                        <li>Divulgación Inapropiada de Información</li>
                        <li>Ignorar el Canal de Denuncia Ética</li>
                        <li>Falta de Transparencia</li>
                    </ul>
                    <Typography variant="h4">¿Cómo reportar?</Typography>
                    <ul>
                        <li>
                            Para realizar un reporte, le invitamos a completar
                            el formulario disponible al final de esta página.
                            Agradecemos su colaboración.
                        </li>
                        {/* <li>Completando el formulario en línea en la página web de la empresa</li> */}
                    </ul>
                    <Typography variant="h4">Confidencialidad</Typography>
                    <Typography variant="body1">
                        La empresa se compromete a garantizar la
                        confidencialidad de las denuncias recibidas a través de
                        la línea ética. Las denuncias se investigarán de manera
                        imparcial y objetiva, y se tomarán las medidas adecuadas
                        para proteger a los denunciantes.
                    </Typography>
                    <Typography variant="h4">
                        ¿Qué ocurre si reporto una conducta?
                    </Typography>
                    <Typography variant="body1">
                        Si reportas una conducta a través de la línea ética, la
                        empresa iniciará una investigación para determinar si la
                        denuncia es fundada. Si la denuncia es fundada, la
                        empresa tomará las medidas adecuadas para corregir la
                        situación y garantizar que no vuelva a ocurrir.
                    </Typography>
                    <Typography variant="body1">
                        La empresa agradece su cooperación en el mantenimiento
                        de un ambiente de trabajo seguro y respetuoso.
                    </Typography>
                </Box>
                <Formik
                    initialValues={baseInitialValues}
                    validationSchema={baseValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                }}
                            >
                                <FormikTextField
                                    type="select"
                                    options={complaintType}
                                    name="complaint"
                                    label="Tipo de denuncia"
                                    autoComplete="off"
                                    spellCheck={false}
                                />

                                <FormikTextField
                                    width="100%"
                                    type="text"
                                    multiline={true}
                                    rows={8}
                                    name="description"
                                    label="Detalle de la novedad presentada"
                                    autoComplete="off"
                                    spellCheck={false}
                                />

                                <FormControl>
                                    <FormLabel id="radio" htmlFor="radio">
                                        ¿Desea proveer algún método de contacto
                                        para mantenerlo informado del caso?
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="radio"
                                        name="radio"
                                    >
                                        <Field
                                            as={RadioGroup}
                                            name="radio"
                                            id="radio"
                                            row
                                            aria-labelledby="radio"
                                        >
                                            <FormControlLabel
                                                onClick={() => {
                                                    openCollapse();
                                                    setFieldValue(
                                                        'contact',
                                                        ''
                                                    );
                                                }}
                                                value="si"
                                                control={<Radio />}
                                                label="Si"
                                            />
                                            <FormControlLabel
                                                onClick={() => {
                                                    closeCollapse();
                                                    setFieldValue(
                                                        'contact',
                                                        ''
                                                    );
                                                }}
                                                value="no"
                                                control={<Radio />}
                                                label="No"
                                            />
                                        </Field>
                                    </RadioGroup>
                                    <FormikError name="radio" />{' '}
                                    {/* Use the custom FormikError component */}
                                </FormControl>

                                <Collapse in={collapse}>
                                    <FormikTextField
                                        width={330}
                                        type="text"
                                        name="contact"
                                        label="Correo o número de contacto"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                </Collapse>

                                <Button
                                    disabled={loadingBar}
                                    type="submit"
                                    sx={{ width: 'max-content' }}
                                    variant="outlined"
                                    endIcon={<SendIcon />}
                                >
                                    Enviar
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
                {loadingBar && (
                    <Box
                        sx={{
                            width: '100%',
                            position: 'absolute',
                            zIndex: 1000,
                            top: 0,
                            left: 0,
                        }}
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
            </Container>
        </>
    );
};

export default EthicalLine;
