import React, { useState, useEffect } from 'react';
// Libraries
import * as Yup from 'yup';
import { Formik, Form, useField } from 'formik';
import { useNavigate } from 'react-router-dom';

// Custom Components
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';
import {
    CustomNoResultsOverlay,
    CustomNoRowsOverlay,
} from '../../assets/CustomDataGridOverlays';

// Material-UI
import {
    Container,
    Box,
    Button,
    Typography,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Divider,
    Chip,
} from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridActionsCellItem,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';

// Icons
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Campo requerido'),
    city: Yup.string().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
    expected_start_date: Yup.string().required('Campo requerido'),
    value: Yup.string()
        .typeError('Valores incorrectos')
        .required('Campo requerido')
        .matches(
            /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/,
            'Formato incorrecto. Ejemplo válido: 100.000.000,09'
        ),
    monthly_cost: Yup.string()
        .typeError('Valores incorrectos')
        .required('Campo requerido')
        .matches(
            /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/,
            'Formato incorrecto. Ejemplo válido: 100.000.000,09'
        ),
    duration: Yup.string().required('Campo requerido'),
    contact: Yup.string().required('Campo requerido'),
    contact_telephone: Yup.number()
        .typeError('Numero de teléfono incorrecto')
        .required('Campo requerido'),
    start_date: Yup.string().required('Campo requerido'),
    civil_responsibility_policy: Yup.string().required('Campo requerido'),
    civil_responsibility_policy_number:
        Yup.string().required('Campo requerido'),
    civil_responsibility_policy_start_date:
        Yup.string().required('Campo requerido'),
    civil_responsibility_policy_end_date:
        Yup.string().required('Campo requerido'),

    civil_responsibility_policy_2: Yup.string(),
    civil_responsibility_policy_number_2: Yup.string(),
    civil_responsibility_policy_start_date_2: Yup.string(),
    civil_responsibility_policy_end_date_2: Yup.string(),

    civil_responsibility_policy_3: Yup.string(),
    civil_responsibility_policy_number_3: Yup.string(),
    civil_responsibility_policy_start_date_3: Yup.string(),
    civil_responsibility_policy_end_date_3: Yup.string(),

    compliance_policy: Yup.string().required('Campo requerido'),
    compliance_policy_number: Yup.string().required('Campo requerido'),
    compliance_policy_start_date: Yup.string().required('Campo requerido'),
    compliance_policy_end_date: Yup.string().required('Campo requerido'),

    compliance_policy_2: Yup.string(),
    compliance_policy_number_2: Yup.string(),
    compliance_policy_start_date_2: Yup.string(),
    compliance_policy_end_date_2: Yup.string(),

    compliance_policy_3: Yup.string(),
    compliance_policy_number_3: Yup.string(),
    compliance_policy_start_date_3: Yup.string(),
    compliance_policy_end_date_3: Yup.string(),

    insurance_policy: Yup.string().required('Campo requerido'),
    insurance_policy_number: Yup.string().required('Campo requerido'),
    insurance_policy_start_date: Yup.string().required('Campo requerido'),
    insurance_policy_end_date: Yup.string().required('Campo requerido'),

    insurance_policy_2: Yup.string(),
    insurance_policy_number_2: Yup.string(),
    insurance_policy_start_date_2: Yup.string(),
    insurance_policy_end_date_2: Yup.string(),

    insurance_policy_3: Yup.string(),
    insurance_policy_number_3: Yup.string(),
    insurance_policy_start_date_3: Yup.string(),
    insurance_policy_end_date_3: Yup.string(),

    renovation_date: Yup.string().required('Campo requerido'),
});

const initialInputs = [
    { name: 'name', label: 'Clientes', type: 'text' },
    { name: 'city', label: 'Ciudad', type: 'text' },
    { name: 'description', label: 'Descripción', type: 'text' },
    {
        name: 'expected_start_date',
        label: 'Fecha de Inicio Estimada',
        type: 'date',
    },
    { name: 'value', label: 'Valor del Contrato', type: 'text' },
    { name: 'monthly_cost', label: 'Facturación Mensual', type: 'text' },
    { name: 'duration', label: 'Duración', type: 'date' },
    { name: 'contact', label: 'Nombre del Contacto', type: 'text' },
    { name: 'contact_telephone', label: 'Teléfono', type: 'text' },
    { name: 'start_date', label: 'Fecha de Inicio', type: 'date' },
    {
        name: 'civil_responsibility_policy',
        label: 'Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'text',
    },
    {
        name: 'civil_responsibility_policy_number',
        label: 'Numero Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'text',
    },
    {
        name: 'civil_responsibility_policy_start_date',
        label: 'Fecha Inicio Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'date',
    },
    {
        name: 'civil_responsibility_policy_end_date',
        label: 'Fecha Fin Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'date',
    },

    {
        name: 'civil_responsibility_policy_2',
        label: 'Segunda Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'text',
    },
    {
        name: 'civil_responsibility_policy_number_2',
        label: 'Segundo Numero Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'text',
    },
    {
        name: 'civil_responsibility_policy_start_date_2',
        label: 'Segunda Fecha Inicio Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'date',
    },
    {
        name: 'civil_responsibility_policy_end_date_2',
        label: 'Segunda Fecha Fin Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'date',
    },
    {
        name: 'civil_responsibility_policy_3',
        label: 'Tercera Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'text',
    },
    {
        name: 'civil_responsibility_policy_number_3',
        label: 'Tercero Numero Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'text',
    },
    {
        name: 'civil_responsibility_policy_start_date_3',
        label: 'Tercera Fecha Inicio Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'date',
    },
    {
        name: 'civil_responsibility_policy_end_date_3',
        label: 'Tercera Fecha Fin Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento',
        type: 'date',
    },
    {
        name: 'compliance_policy',
        label: 'Póliza de Cumplimiento',
        type: 'text',
    },
    {
        name: 'compliance_policy_number',
        label: 'Numero Póliza de Cumplimiento',
        type: 'text',
    },
    {
        name: 'compliance_policy_start_date',
        label: 'Fecha Inicio Póliza de Cumplimiento',
        type: 'date',
    },
    {
        name: 'compliance_policy_end_date',
        label: 'Fecha Fin Póliza de Cumplimiento',
        type: 'date',
    },

    {
        name: 'compliance_policy_2',
        label: 'Segunda Póliza de Cumplimiento',
        type: 'text',
    },
    {
        name: 'compliance_policy_number_2',
        label: 'Segundo Numero Póliza de Cumplimiento',
        type: 'text',
    },
    {
        name: 'compliance_policy_start_date_2',
        label: 'Segunda Fecha Inicio Póliza de Cumplimiento',
        type: 'date',
    },
    {
        name: 'compliance_policy_end_date_2',
        label: 'Segunda Fecha Fin Póliza de Cumplimiento',
        type: 'date',
    },

    {
        name: 'compliance_policy_3',
        label: 'Tercera Póliza de Cumplimiento',
        type: 'text',
    },
    {
        name: 'compliance_policy_number_3',
        label: 'Tercero Numero Póliza de Cumplimiento',
        type: 'text',
    },
    {
        name: 'compliance_policy_start_date_3',
        label: 'Tercera Fecha Inicio Póliza de Cumplimiento',
        type: 'date',
    },
    {
        name: 'compliance_policy_end_date_3',
        label: 'Tercera Fecha Fin Póliza de Cumplimiento',
        type: 'date',
    },

    {
        name: 'insurance_policy',
        label: 'Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'text',
    },
    {
        name: 'insurance_policy_number',
        label: 'Numero Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'text',
    },
    {
        name: 'insurance_policy_start_date',
        label: 'Fecha Inicio Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'date',
    },
    {
        name: 'insurance_policy_end_date',
        label: 'Fecha Fin Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'date',
    },

    {
        name: 'insurance_policy_2',
        label: 'Segunda Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'text',
    },
    {
        name: 'insurance_policy_number_2',
        label: 'Segundo Numero Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'text',
    },
    {
        name: 'insurance_policy_start_date_2',
        label: 'Segunda Fecha Inicio Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'date',
    },
    {
        name: 'insurance_policy_end_date_2',
        label: 'Segunda Fecha Fin Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'date',
    },

    {
        name: 'insurance_policy_3',
        label: 'Tercera Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'text',
    },
    {
        name: 'insurance_policy_number_3',
        label: 'Tercero Numero Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'text',
    },
    {
        name: 'insurance_policy_start_date_3',
        label: 'Tercera Fecha Inicio Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'date',
    },
    {
        name: 'insurance_policy_end_date_3',
        label: 'Tercera Fecha Fin Póliza Seguros de Responsabilidad Profesional por Perdida de Datos',
        type: 'date',
    },

    { name: 'renovation_date', label: 'Renovación del contrato', type: 'date' },
];

export const Legal = () => {
    const initialValues = {
        name: '',
        city: '',
        description: '',
        expected_start_date: '',
        value: '',
        monthly_cost: '',
        duration: '',
        contact: '',
        contact_telephone: '',
        start_date: '',
        civil_responsibility_policy: '',
        civil_responsibility_policy_number: '',
        civil_responsibility_policy_start_date: '',
        civil_responsibility_policy_end_date: '',

        civil_responsibility_policy_2: '',
        civil_responsibility_policy_number_2: '',
        civil_responsibility_policy_start_date_2: '',
        civil_responsibility_policy_end_date_2: '',

        civil_responsibility_policy_3: '',
        civil_responsibility_policy_number_3: '',
        civil_responsibility_policy_start_date_3: '',
        civil_responsibility_policy_end_date_3: '',

        compliance_policy: '',
        compliance_policy_number: '',
        compliance_policy_start_date: '',
        compliance_policy_end_date: '',

        compliance_policy_2: '',
        compliance_policy_number_2: '',
        compliance_policy_start_date_2: '',
        compliance_policy_end_date_2: '',

        compliance_policy_3: '',
        compliance_policy_number_3: '',
        compliance_policy_start_date_3: '',
        compliance_policy_end_date_3: '',

        insurance_policy: '',
        insurance_policy_number: '',
        insurance_policy_start_date: '',
        insurance_policy_end_date: '',

        insurance_policy_2: '',
        insurance_policy_number_2: '',
        insurance_policy_start_date_2: '',
        insurance_policy_end_date_2: '',

        insurance_policy_3: '',
        insurance_policy_number_3: '',
        insurance_policy_start_date_3: '',
        insurance_policy_end_date_3: '',

        renovation_date: '',
    };

    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [details, setDetails] = useState({});
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [inputs, setInputs] = useState(initialInputs);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    const [newInitialValues, setNewInitialValues] = useState(initialValues);
    const [newValidationSchema, setNewValidationSchema] =
        useState(validationSchema);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes('contracts.view_contract')) {
            navigate('/logged/home');
        }
    }, []);

    const getPolicies = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${getApiUrl().apiUrl}contracts/`, {
                method: 'GET',
                credentials: 'include',
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setRows(data);
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPolicies();
    }, []);

    const getDetails = async (id) => {
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}contracts/${id}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setDetails(data);
                handleOpenDialogEdit();
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewInitialValues(initialValues);
        setNewValidationSchema(validationSchema);
        setInputs(initialInputs);
    };

    const handleCloseDialogEdit = () => {
        setOpenDialogEdit(false);
        setDisabled(false);
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleOpenDialogEdit = () => {
        setDisabled(true);
        setOpenDialogEdit(true);
    };

    const handleDisabledChange = () => {
        setDisabled(!disabled);
    };

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const handleDeleteClick = async (id) => {
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}contracts/${id}`,
                {
                    method: 'delete',
                    credentials: 'include',
                }
            );

            await handleError(response, showSnack);

            if (response.status === 204) {
                setRows(rows.filter((row) => row.id !== id));
                getPolicies();
                showSnack(
                    'success',
                    'Se ha eliminado el registro correctamente.'
                );
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        }
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: 'contratos-pólizas-legales',
                        delimiter: ';',
                        utf8WithBom: true,
                    }}
                />
                {permissions.includes('contracts.add_contract') ? (
                    <Button
                        size="small"
                        onClick={handleOpenDialog}
                        startIcon={<PersonAddAlt1Icon />}
                    >
                        AÑADIR
                    </Button>
                ) : null}
                <Box sx={{ textAlign: 'end', flex: '1' }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    const handleSubmit = async (values) => {
        const formatCOPValue = (value) => {
            return value.replace(/\./g, '').replace(',', '.');
        };

        const formatCOPFields = (values) => {
            const fieldsToFormat = [
                'value',
                'monthly_cost',
                'insurance_policy',
            ];

            fieldsToFormat.forEach((field) => {
                if (values[field]) {
                    values[field] = formatCOPValue(values[field]);
                }
            });
        };

        formatCOPFields(values);

        try {
            const response = await fetch(`${getApiUrl().apiUrl}contracts/`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
            });

            await handleError(response, showSnack);

            if (response.status === 201) {
                handleCloseDialog();
                getPolicies();
                showSnack('success', 'Se ha creado el registro correctamente.');
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        }
    };

    const handleSubmitEdit = async (values) => {
        const formatCOPValue = (value) => {
            return value.replace(/\./g, '').replace(',', '.');
        };

        const formatCOPFields = (values) => {
            const fieldsToFormat = [
                'value',
                'monthly_cost',
                'insurance_policy',
            ];

            fieldsToFormat.forEach((field) => {
                if (values[field]) {
                    values[field] = formatCOPValue(values[field]);
                }
            });
        };

        formatCOPFields(values);
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}contracts/${values.id}/`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    body: JSON.stringify(values),
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            await handleError(response, showSnack);

            if (response.status === 200) {
                handleCloseDialogEdit();
                getPolicies();
                showSnack(
                    'success',
                    'Se ha actualizado el registro correctamente.'
                );
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        }
    };

    const FormikTextField = ({ label, type, rows, ...props }) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : '';
        const textFieldProps = {
            key: props.name,
            sx: {
                width: props.name === 'renovation_date' ? '800px' : '390px',
                mt: props.name === 'renovation_date' ? '2rem' : {},
            },
            disabled: disabled,
            rows: rows,
            InputLabelProps: type === 'date' ? { shrink: true } : {},
            type: type,
            label: label,
            ...field,
            helperText: errorText,
            error: !!errorText,
        };

        if (
            props.name === 'civil_responsibility_policy' ||
            props.name === 'compliance_policy' ||
            props.name === 'insurance_policy'
        ) {
            return (
                <>
                    <Divider sx={{ width: '100%', mt: '2rem' }}>
                        <Chip label={label} size="small" />
                    </Divider>
                    <TextField {...textFieldProps} sx={{ width: '390px' }} />
                </>
            );
        }

        return <TextField {...textFieldProps} />;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Clientes', width: 750, editable: false },
        {
            field: 'duration',
            headerName: 'Duración',
            width: 100,
            editable: false,
        },
        {
            field: 'start_date',
            headerName: 'Fecha Inicio',
            width: 100,
            editable: false,
        },
    ];

    columns.push({
        field: 'actions',
        headerName: 'Acciones',
        width: 100,
        type: 'actions',
        cellClassName: 'actions',
        getActions: ({ row }) => {
            return [
                <Tooltip key={`tooltip-${row.id}`} title="Mas Detalles">
                    <GridActionsCellItem
                        onClick={() => getDetails(row.id)}
                        sx={{
                            transition: '.3s ease',
                            '&:hover': { color: 'primary.main' },
                        }}
                        icon={<MoreHorizIcon />}
                        label="Detalles"
                    />
                </Tooltip>,
                <Tooltip key={`tooltip-${row.id}`} title="Eliminar Registro">
                    <GridActionsCellItem
                        sx={{
                            transition: '.3s ease',
                            '&:hover': { color: 'red' },
                        }}
                        icon={<DeleteIcon />}
                        label="Eliminar"
                        onClick={() => handleDeleteClick(row.id)}
                    />
                </Tooltip>,
            ];
        },
    });

    return (
        <>
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginTop: '6rem',
                }}
            >
                <Typography
                    sx={{
                        textAlign: 'center',
                        pb: '15px',
                        color: 'primary.main',
                    }}
                    variant={'h4'}
                >
                    Contratos y Pólizas Legales
                </Typography>
                <Box
                    sx={{
                        height: '80vh',
                        boxShadow: '0px 0px 5px 0px #e0e0e0',
                        borderRadius: '10px',
                    }}
                >
                    <DataGrid
                        loading={loading}
                        columns={columns}
                        rows={rows}
                        slots={{
                            toolbar: CustomToolbar,
                            noResultsOverlay: CustomNoResultsOverlay,
                            noRowsOverlay: CustomNoRowsOverlay,
                        }}
                        slotProps={{
                            loadingOverlay: {
                                variant: 'skeleton',
                                noRowsVariant: 'skeleton',
                            },
                        }}
                    ></DataGrid>
                </Box>
            </Container>
            <SnackbarAlert
                message={message}
                severity={severity}
                openSnack={openSnack}
                closeSnack={handleCloseSnack}
            />
            <Dialog
                maxWidth={'md'}
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Añadir un nuevo registro</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={newInitialValues}
                        validationSchema={newValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    pt: '0.5rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {inputs.map((input) => (
                                    <FormikTextField
                                        key={input.name}
                                        type={input.type}
                                        name={input.name}
                                        label={input.label}
                                        rows={3}
                                    />
                                ))}
                                <Button type="submit" startIcon={<SaveIcon />}>
                                    Guardar
                                </Button>
                            </Box>
                        </Form>
                    </Formik>
                </DialogContent>
            </Dialog>

            <Dialog
                maxWidth={'md'}
                open={openDialogEdit}
                onClose={handleCloseDialogEdit}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>Detalles del registro</Box>
                    <IconButton
                        sx={{ color: 'primary.main' }}
                        aria-label="edit"
                        onClick={handleDisabledChange}
                    >
                        <ModeEditIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Formik initialValues={details} onSubmit={handleSubmitEdit}>
                        <Form>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    pt: '0.5rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {inputs.map((input) => (
                                    <FormikTextField
                                        key={input.name}
                                        type={input.type}
                                        name={input.name}
                                        label={input.label}
                                    />
                                ))}
                                <Button
                                    disabled={disabled}
                                    type="submit"
                                    startIcon={<SaveIcon />}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </Form>
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Legal;
