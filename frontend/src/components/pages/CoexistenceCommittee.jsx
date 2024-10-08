import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import SendIcon from '@mui/icons-material/Send';
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';

// Media
import CoexistenceCommitteeSVG from '../../images/coexistence-committee/coexistence-committee.svg';

// Opciones de motivos de la denuncia
const motivos = [
    { value: 'Acoso laboral' },
    { value: 'Conflictos personales entre empleados' },
    { value: 'Discriminación' },
    { value: 'Maltrato verbal o físico' },
    { value: 'Otro' },
];

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    area: Yup.string().required('Campo requerido'),
    motivo: Yup.string().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
});

// Componente para renderizar campos de formulario con Formik y MUI
const FormikTextField = ({
    type,
    label,
    options,
    multiline,
    rows,
    ...props
}) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    return (
        <TextField
            fullWidth
            select={type === 'select'}
            multiline={multiline}
            rows={rows}
            label={label}
            {...field}
            error={!!errorText}
            helperText={errorText}
        >
            {type === 'select' &&
                options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.value}
                    </MenuItem>
                ))}
        </TextField>
    );
};

// Componente principal del Comité de Convivencia
const CoexistenceCommittee = () => {
    const [loadingBar, setLoadingBar] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState('');

    const handleCloseSnack = () => setOpenSnack(false);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    // Maneja el envío del formulario
    const handleSubmit = async (values) => {
        setLoadingBar(true);

        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}pqrs/complaints/`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                    credentials: 'include',
                }
            );

            setLoadingBar(false);
            await handleError(response, showSnack);
        } catch (error) {
            console.error(error);
            setLoadingBar(false);
        }
    };

    return (
        <Container sx={{ my: '5rem' }}>
            <Box sx={{ padding: 3 }}>
                <img
                    src={CoexistenceCommitteeSVG}
                    alt="Coexistence Committee"
                    style={{
                        width: '70%',
                        height: 'auto',
                        display: 'block',
                        margin: 'auto',
                    }}
                />

                <Typography variant="h4" gutterBottom>
                    Comité de Convivencia
                </Typography>

                <Typography paragraph>
                    Es un organismo interno de la empresa encargado de promover
                    un ambiente de trabajo saludable, seguro y respetuoso para
                    todos los colaboradores. Su principal objetivo es prevenir,
                    gestionar y solucionar de manera efectiva los conflictos y
                    situaciones que puedan afectar la armonía laboral y las
                    relaciones interpersonales dentro de la organización.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    ¿Para qué sirve el Comité de Convivencia?
                </Typography>

                <Typography paragraph>
                    El Comité de Convivencia tiene varias funciones esenciales:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemText
                            primary={<strong>Prevenir el acoso laboral</strong>}
                            secondary="A través de estrategias y capacitaciones, se busca sensibilizar a los empleados sobre la importancia del respeto y la convivencia sana en el entorno de trabajo."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={<strong>Mediar en conflictos</strong>}
                            secondary="Actúa como un mediador neutral en situaciones de conflicto entre empleados, con el fin de encontrar soluciones que beneficien a ambas partes y restablecer un buen ambiente laboral."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={<strong>Proponer mejoras</strong>}
                            secondary="El comité puede sugerir políticas o actividades que fortalezcan la convivencia y minimicen el riesgo de conflictos o acoso."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={
                                <strong>Garantizar el bienestar laboral</strong>
                            }
                            secondary="A través del monitoreo continuo de las relaciones interpersonales, el comité asegura que los empleados puedan desarrollar su trabajo en un entorno respetuoso y libre de tensiones."
                        />
                    </ListItem>
                </List>

                {/* Formulario para enviar mensajes al Comité */}
                <Formik
                    initialValues={{ area: '', motivo: '', description: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            <Typography sx={{ fontWeight: 700 }}>
                                Si deseas enviar un mensaje al Comité de
                                Convivencia, por favor completa el siguiente
                                formulario:
                            </Typography>

                            <FormikTextField
                                type="select"
                                options={motivos}
                                name="motivo"
                                label="Motivo"
                                autoComplete="off"
                            />

                            <FormikTextField
                                type="text"
                                multiline={true}
                                rows={8}
                                name="description"
                                label="Deja tu mensaje aquí"
                                autoComplete="off"
                            />

                            <Button
                                disabled={loadingBar}
                                type="submit"
                                sx={{ alignSelf: 'flex-start' }}
                                variant="outlined"
                                endIcon={<SendIcon />}
                            >
                                Enviar
                            </Button>
                        </Box>
                    </Form>
                </Formik>
            </Box>

            {/* Barra de carga */}
            {loadingBar && (
                <Box
                    sx={{
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1000,
                    }}
                >
                    <LinearProgress variant="indeterminate" />
                </Box>
            )}

            {/* Alerta Snackbar */}
            <SnackbarAlert
                message={message}
                severity={severity}
                openSnack={openSnack}
                closeSnack={handleCloseSnack}
            />
        </Container>
    );
};

export default CoexistenceCommittee;
