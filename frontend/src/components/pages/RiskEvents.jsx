import { useState, useEffect } from 'react';

// Libraries
import { useNavigate } from 'react-router-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

// Custom components
import { getApiUrl } from '../../assets/getApi';
import SnackbarAlert from '../common/SnackBarAlert';
import { handleError } from '../../assets/handleError';
import {
    CustomNoResultsOverlay,
    CustomNoRowsOverlay,
} from '../../assets/CustomDataGridOverlays';

// Material-UI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbarDensitySelector,
    GridActionsCellItem,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MoreIcon from '@mui/icons-material/More';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const validationSchema = Yup.object().shape({
    event_class: Yup.string().required('Campo requerido'),
    level: Yup.string().required('Campo requerido'),
    process: Yup.string().required('Campo requerido'),
    lost_type: Yup.string().required('Campo requerido'),
    product: Yup.string().required('Campo requerido'),
    start_date: Yup.string().required('Campo requerido'),
    end_date: Yup.string().required('Campo requerido'),
    discovery_date: Yup.string().required('Campo requerido'),
    accounting_date: Yup.string().required('Campo requerido'),
    currency: Yup.string().required('Campo requerido'),
    quantity: Yup.string().required('Campo requerido'),
    recovered_quantity: Yup.string().required('Campo requerido'),
    recovered_quantity_by_insurance: Yup.string().required('Campo requerido'),
    reported_by: Yup.string().required('Campo requerido'),
    critical: Yup.string().required('Campo requerido'),
    plan: Yup.string().required('Campo requerido'),
    event_title: Yup.string().required('Campo requerido'),
    public_accounts_affected: Yup.string().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
    close_date: Yup.string().required('Campo requerido'),
    learning: Yup.string().required('Campo requerido'),
    status: Yup.string().required('Campo requerido'),
});

export const RiskEvent = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [details, setDetails] = useState({});
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem('permissions'));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (
            !permissions ||
            !permissions.includes('operational_risk.view_events')
        ) {
            navigate('/logged/home');
        }
    }, []);

    const getOperationalRisk = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}operational-risk/`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

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

    const cleanUpDetails = (details) => {
        const cleanedDetails = { ...details };

        // Replace null or undefined values with a default value (e.g., '')
        Object.keys(cleanedDetails).forEach((key) => {
            cleanedDetails[key] = cleanedDetails[key] ?? '';

            // if (key === "close_date" && cleanedDetails[key]) {
            //     // Assuming cleanedDetails[key] is a valid date string
            //     cleanedDetails[key] = new Date(cleanedDetails[key]).toISOString().split("T")[0];
            // }
        });

        setDetails(cleanedDetails);
    };

    const getDetails = async (id) => {
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}operational-risk/${id}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                cleanUpDetails(data);
                handleOpenDialogEdit();
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getOperationalRisk();
    }, []);

    const handleCloseDialog = () => setOpenDialog(false);
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
                `${getApiUrl().apiUrl}operational-risk/${id}`,
                {
                    method: 'delete',
                    credentials: 'include',
                }
            );

            await handleError(response, showSnack);

            if (response.status === 204) {
                setRows(rows.filter((row) => row.id !== id));
                getOperationalRisk();
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
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: 'eventos-riesgo-operativo',
                        delimiter: ';',
                        utf8WithBom: true,
                    }}
                />
                {permissions.includes('operational_risk.add_events') ? (
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
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}operational-risk/`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(values),
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            await handleError(response, showSnack);

            if (response.status === 201) {
                handleCloseDialog();
                getOperationalRisk();
                showSnack('success', 'Se ha creado el registro correctamente.');
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        }
    };

    const handleSubmitEdit = async (values) => {
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}operational-risk/${values.id}/`,
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
                getOperationalRisk();
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

    const FormikTextField = ({
        label,
        type,
        options,
        multiline,
        rows,
        ...props
    }) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : '';
        if (type === 'select') {
            return (
                <TextField
                    disabled={disabled}
                    sx={{ width: '390px' }}
                    select
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
        } else if (label === 'Renovación del contrato') {
            return (
                <TextField
                    sx={{ width: '800px' }}
                    InputLabelProps={{ shrink: true }}
                    multiline={multiline}
                    rows={rows}
                    type={type}
                    label={label}
                    disabled={disabled}
                    {...field}
                    helperText={errorText}
                    error={!!errorText}
                />
            );
        } else if (type === 'date' || type === 'datetime-local') {
            return (
                <TextField
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: '390px' }}
                    rows={rows}
                    type={type}
                    label={label}
                    disabled={disabled}
                    {...field}
                    helperText={errorText}
                    error={!!errorText}
                />
            );
        } else if (multiline) {
            return (
                <TextField
                    sx={{ width: '800px' }}
                    disabled={disabled}
                    multiline={multiline}
                    rows={rows}
                    type={type}
                    label={label}
                    {...field}
                    helperText={errorText}
                    error={!!errorText}
                />
            );
        } else {
            return (
                <TextField
                    sx={{ width: '390px' }}
                    disabled={disabled}
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

    const columns = [
        { field: 'id', type: 'number', headerName: 'ID', width: 70 },
        {
            field: 'start_date',
            type: 'dateTime',
            headerName: 'Fecha de Inicio',
            hidden: true,
            width: 200,
            valueGetter: (value) => {
                if (value) {
                    return new Date(value);
                } else {
                    return '';
                }
            },
        },
        {
            field: 'end_date',
            type: 'dateTime',
            headerName: 'Fecha de Fin',
            width: 200,
            editable: false,
            valueGetter: (value) => {
                if (value) {
                    return new Date(value);
                } else {
                    return '';
                }
            },
        },
        {
            field: 'discovery_date',
            type: 'dateTime',
            headerName: 'Fecha de Descubrimiento',
            width: 200,
            editable: false,
            valueGetter: (value) => {
                if (value) {
                    return new Date(value);
                } else {
                    return '';
                }
            },
        },
        {
            field: 'accounting_date',
            type: 'date',
            headerName: 'Fecha de Atención',
            width: 200,
            editable: false,
            valueGetter: (value) => {
                if (value) {
                    return new Date(value);
                } else {
                    return '';
                }
            },
        },
        {
            field: 'currency',
            type: 'singleSelect',
            headerName: 'Divisa',
            width: 100,
            editable: false,
            valueOptions: [
                { value: 'COP', label: 'COP' },
                { value: 'USD', label: 'USD' },
            ],
        },
        {
            field: 'quantity',
            type: 'number',
            headerName: 'Cuantía',
            width: 100,
            editable: false,
        },
        {
            field: 'recovered_quantity',
            type: 'number',
            headerName: 'Cuantía Total Recuperada',
            width: 100,
            editable: false,
        },
        {
            field: 'recovered_quantity_by_insurance',
            type: 'number',
            headerName: 'Cuantía Rec. x Seguros',
            width: 100,
            editable: false,
        },
        {
            field: 'event_class',
            type: 'singleSelect',
            headerName: 'Clase de Evento',
            width: 100,
            editable: false,
            valueOptions: [
                { value: 'FRAUDE INTERNO', label: 'Fraude Interno' },
                { value: 'FRAUDE EXTERNO', label: 'Fraude Externo' },
                {
                    value: 'RELACIONES LABORALES',
                    label: 'Relaciones Laborales',
                },
                { value: 'CLIENTES', label: 'Clientes' },
                {
                    value: 'DAÑOS ACTIVOS FISICOS',
                    label: 'Daños Activos Físicos',
                },
                { value: 'FALLAS TECNOLOGICAS', label: 'Fallas Tecnológicas' },
                {
                    value: 'EJECUCION Y ADMINISTRACION DE PROCESOS',
                    label: 'Ejecución y Administración de Procesos',
                },
                { value: 'AGENTES EXTERNOS', label: 'Agentes Externos' },
            ],
        },
        {
            field: 'event_title',
            type: 'text',
            headerName: 'Evento',
            width: 100,
            editable: false,
        },
        {
            field: 'process',
            type: 'singleSelect',
            headerName: 'Proceso',
            width: 100,
            editable: false,
            valueOptions: [
                {
                    value: 'ADMINISTRATIVO, INVERSIONES Y TESORERIA',
                    label: 'Administrativo, Inversiones y Tesorería',
                },
                {
                    value: 'BANCOS Y CUENTAS POR PAGAR',
                    label: 'Bancos y Cuentas por Pagar',
                },
                { value: 'CAMPAÑAS', label: 'Campañas' },
                { value: 'CONTABILIDAD', label: 'Contabilidad' },
                { value: 'IMPUESTOS', label: 'Impuestos' },
                { value: 'PERSONAL Y NOMINA', label: 'Personal y Nomina' },
                {
                    value: 'PLANEACION ESTRATEGICA',
                    label: 'Planeación Estratégica',
                },
                { value: 'SERVICIOS GENERALES', label: 'Servicios Generales' },
                { value: 'SISTEMAS', label: 'Sistemas' },
                { value: 'VISITADORES', label: 'Visitadores' },
            ],
        },
        {
            field: 'lost_type',
            type: 'singleSelect',
            headerName: 'Tipo de Perdida',
            width: 100,
            editable: false,
            valueOptions: [
                {
                    value: 'GENERAN PERDIDAS Y AFECTAN EL PYG',
                    label: 'Generan Perdidas y Afectan el PYG',
                },
                {
                    value: 'GENERAN PERDIDAS Y NO AFECTAN EL PYG',
                    label: 'Generan Perdidas y no Afectan el PYG',
                },
                {
                    value: 'NO GENERAN PERDIDA Y NO AFECTAN EL PYG',
                    label: 'No Generan Perdida y no Afectan el PYG',
                },
            ],
        },
        {
            field: 'description',
            type: 'text',
            headerName: 'Descripción del Evento',
            width: 100,
            editable: false,
        },
        {
            field: 'product',
            type: 'singleSelect',
            headerName: 'Producto',
            width: 100,
            editable: false,
            valueOptions: [
                { value: 'AVANTEL', label: 'Avantel' },
                { value: 'AZTECA', label: 'Azteca' },
                { value: 'BANCO AGRARIO', label: 'Banco Agrario' },
                { value: 'BAYPORT', label: 'BayPort' },
                { value: 'CLARO', label: 'Claro' },
                { value: 'CLARO VENTAS', label: 'Claro Ventas' },
                { value: 'CONGENTE', label: 'Congente' },
                { value: 'COOMEVA', label: 'Coomeva' },
                { value: 'FALABELLA', label: 'Falabella' },
                {
                    value: 'GERENCIA ADMINISTRATIVA',
                    label: 'Gerencia Administrativa',
                },
                { value: 'LEGAL Y RIESGO', label: 'Legal y Riesgo' },
                { value: 'METLIFE', label: 'Metlife' },
                { value: 'NUEVA EPS', label: 'Nueva EPS' },
                { value: 'PAYU', label: 'PayU' },
                { value: 'QUALITY', label: 'Quality' },
                { value: 'RECURSOS FISICOS', label: 'Recursos Fisicos' },
                { value: 'RRHH', label: 'RRHH' },
                {
                    value: 'SCOTIABANK COLPATRIA',
                    label: 'Scotiabank Colpatria',
                },
                { value: 'TECNOLOGIA', label: 'Tecnologia' },
                { value: 'TODOS', label: 'Todos' },
                { value: 'YANBAL', label: 'Yanbal' },
            ],
        },
        {
            field: 'status',
            type: 'singleSelect',
            headerName: 'Estado Actual',
            width: 100,
            editable: false,
            valueFormatter: (value) => {
                if (value == false) {
                    return 'CERRADO';
                } else if (value == true) {
                    return 'ABIERTO';
                } else {
                    return '';
                }
            },
            valueOptions: [
                { value: true, label: 'Abierto' },
                { value: false, label: 'Cerrado' },
            ],
        },
        {
            field: 'close_date',
            type: 'date',
            headerName: 'Fecha de Cierre',
            width: 100,
            editable: false,
            valueGetter: (value) => {
                if (value) {
                    return new Date(value);
                } else {
                    return '';
                }
            },
        },
        {
            field: 'reported_by',
            type: '',
            headerName: 'Reportado Por',
            width: 100,
            editable: false,
        },
        {
            field: 'critical',
            type: 'singleSelect',
            headerName: 'Clasificación',
            width: 100,
            valueFormatter: (value) => {
                if (value == false) {
                    return 'NO CRITICO';
                } else if (value == true) {
                    return 'CRITICO';
                } else {
                    return '';
                }
            },
            editable: false,
            valueOptions: [
                { value: true, label: 'Critico' },
                { value: false, label: 'No Critico' },
            ],
        },
        {
            field: 'level',
            type: 'singleSelect',
            headerName: 'Nivel',
            width: 100,
            editable: false,
            valueOptions: [
                { value: 'BAJO', label: 'Bajo' },
                { value: 'MEDIO', label: 'Medio' },
                { value: 'ALTO', label: 'Alto' },
            ],
        },
        {
            field: 'public_accounts_affected',
            type: 'text',
            headerName: 'Cuentas PUC Afectadas',
            width: 100,
            editable: false,
        },
        {
            field: 'plan',
            type: '',
            headerName: 'Plan',
            width: 100,
            editable: false,
        },
        {
            field: 'learning',
            type: '',
            headerName: 'Aprendizaje',
            width: 100,
            editable: false,
        },
    ];

    const initialValues = columns.reduce((acc, column) => {
        acc[column.field] = ''; // Set initial text value
        return acc;
    }, {});

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
                        icon={<MoreIcon />}
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
                    Eventos de Riesgo Operativo
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
                        initialState={{
                            sorting: {
                                sortModel: [
                                    { field: 'start_date', sort: 'desc' },
                                ],
                            },
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                },
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
                        initialValues={initialValues}
                        validationSchema={validationSchema}
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
                                {columns.map((column) => {
                                    if (column.field === 'actions') {
                                        return null;
                                    } else if (column.field === 'id') {
                                        return null;
                                    } else if (
                                        column.field === 'start_date' ||
                                        column.field === 'end_date' ||
                                        column.field === 'discovery_date'
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="datetime-local"
                                                key={column.field}
                                                name={column.field}
                                                label={column.headerName}
                                            />
                                        );
                                    } else if (
                                        column.field === 'close_date' ||
                                        column.field === 'accounting_date'
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="date"
                                                key={column.field}
                                                name={column.field}
                                                label={column.headerName}
                                            />
                                        );
                                    } else if (
                                        column.field === 'renovation_date'
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="date"
                                                key={column.field}
                                                name={column.field}
                                                label={column.headerName}
                                            />
                                        );
                                    } else if (
                                        column.field === 'event_class' ||
                                        column.field === 'process' ||
                                        column.field === 'currency' ||
                                        column.field === 'lost_type' ||
                                        column.field === 'product' ||
                                        column.field === 'status' ||
                                        column.field === 'level' ||
                                        column.field === 'critical'
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="select"
                                                key={column.field}
                                                name={column.field}
                                                label={column.headerName}
                                                select
                                                autoComplete="off"
                                                spellCheck={false}
                                                options={column.valueOptions}
                                            ></FormikTextField>
                                        );
                                    } else {
                                        return (
                                            <FormikTextField
                                                key={column.field}
                                                type="text"
                                                name={column.field}
                                                label={column.headerName}
                                                autoComplete="off"
                                                spellCheck={false}
                                            />
                                        );
                                    }
                                })}
                            </Box>
                            <Box sx={{ mt: '1rem' }}>
                                <Button
                                    type="submit"
                                    startIcon={<SaveIcon></SaveIcon>}
                                    variant="contained"
                                >
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
                    <Formik
                        initialValues={details}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmitEdit}
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
                                {columns.map((column) => {
                                    if (column.field === 'actions') {
                                        return null;
                                    } else if (column.field === 'id') {
                                        return null;
                                    } else if (
                                        column.field === 'start_date' ||
                                        column.field === 'end_date' ||
                                        column.field === 'discovery_date'
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="datetime-local"
                                                key={column.field}
                                                name={column.field}
                                                label={column.headerName}
                                            />
                                        );
                                    } else if (
                                        column.field === 'close_date' ||
                                        column.field === 'accounting_date'
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="date"
                                                key={column.field}
                                                name={column.field}
                                                label={column.headerName}
                                            />
                                        );
                                    } else if (
                                        column.field === 'renovation_date'
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="date"
                                                key={column.field}
                                                name={column.field}
                                                label={column.headerName}
                                            />
                                        );
                                    } else if (
                                        column.field === 'event_class' ||
                                        column.field === 'process' ||
                                        column.field === 'lost_type' ||
                                        column.field === 'product' ||
                                        column.field === 'status' ||
                                        column.field === 'level' ||
                                        column.field === 'critical' ||
                                        column.field === 'currency'
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="select"
                                                key={column.field}
                                                name={column.field}
                                                label={column.headerName}
                                                select
                                                autoComplete="off"
                                                spellCheck={false}
                                                options={column.valueOptions}
                                            ></FormikTextField>
                                        );
                                    } else {
                                        return (
                                            <FormikTextField
                                                key={column.field}
                                                type="text"
                                                name={column.field}
                                                label={column.headerName}
                                                autoComplete="off"
                                                spellCheck={false}
                                            />
                                        );
                                    }
                                })}
                            </Box>
                            <Box sx={{ mt: '1rem' }}>
                                <Button
                                    disabled={disabled}
                                    type="submit"
                                    startIcon={<SaveIcon></SaveIcon>}
                                    variant="contained"
                                >
                                    Guardar Edición
                                </Button>
                            </Box>
                        </Form>
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RiskEvent;
