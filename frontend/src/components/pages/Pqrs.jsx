import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    LinearProgress,
} from '@mui/material';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import SendIcon from '@mui/icons-material/Send';
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';

// Media
import Pqrs from '../../images/pqrs/pqrs.png';

const areas = [
    { value: 'Gerencia General' },
    { value: 'Gerencia de Riesgo y Control Interno' },
    { value: 'Gerencia Gestión Humana' },
    { value: 'Gerencia de Planeación' },
    { value: 'Gerencia Administrativa' },
    { value: 'Gerencia de Legal' },
    { value: 'Gerencia de Operaciones' },
    { value: 'Gerencia de Recursos Físicos' },
];

const motivos = [
    { value: 'Petición' },
    { value: 'Queja' },
    { value: 'Reclamo' },
    { value: 'Sugerencia' },
    { value: 'Otro' },
];

const validationSchema = Yup.object().shape({
    area: Yup.string().required('Campo requerido'),
    motivo: Yup.string().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
});

const Suggestions = () => {
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
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
            setLoadingBar(false);
        }
    };

    const FormikTextField = ({
        type,
        label,
        options,
        multiline,
        rows,
        width = '100%', // Default width
        ...props
    }) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : '';

        return (
            <TextField
                sx={{ width }}
                select={type === 'select'}
                multiline={multiline}
                rows={rows}
                type={type}
                label={label}
                {...field}
                helperText={errorText}
                error={!!errorText}
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

    return (
        <Container sx={{ my: '5rem' }}>
            <img
                src={Pqrs}
                alt="Coexistence Committee"
                style={{
                    width: '70%',
                    height: 'auto',
                    display: 'block',
                    margin: 'auto',
                }}
            />
            <Box sx={{ pb: '1rem' }}>
                <Typography
                    variant="h4"
                    sx={{ textAlign: 'center', pb: 2, color: 'primary.main' }}
                >
                    PQRS
                </Typography>
                <Typography variant="body1">
                    En esta sección puedes enviar un mensaje a las distintas
                    Gerencias de la Compañía, según tus intereses. Tienes la
                    opción de expresar de manera respetuosa tus inconformidades,
                    inconvenientes, sugerencias o felicitaciones, dirigiendo el
                    mensaje a la Gerencia correspondiente.
                    <br />
                    <br />
                    Ten en cuenta que el contenido de tu mensaje será
                    confidencial y únicamente lo conocerán tú y el Gerente del
                    área seleccionada. Te recomendamos redactar de forma clara,
                    con prudencia y buena ortografía, para asegurar que tu
                    mensaje sea fácilmente comprensible.
                </Typography>
            </Box>

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
                        <FormikTextField
                            type="select"
                            options={areas}
                            name="area"
                            label="Área"
                            autoComplete="off"
                        />
                        <FormikTextField
                            type="select"
                            options={motivos}
                            name="motivo"
                            label="Motivo"
                            autoComplete="off"
                        />
                        <FormikTextField
                            type="text"
                            multiline
                            rows={8}
                            name="description"
                            label="Deja tu mensaje aquí"
                            autoComplete="off"
                        />
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
            </Formik>

            {loadingBar && (
                <Box
                    sx={{
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                >
                    <LinearProgress />
                </Box>
            )}

            <SnackbarAlert
                message={message}
                severity={severity}
                openSnack={openSnack}
                closeSnack={handleCloseSnack}
            />
        </Container>
    );
};

export default Suggestions;
