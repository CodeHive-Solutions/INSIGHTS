import { Fragment, useState, useCallback, useEffect, useRef } from 'react';

// Libraries
import * as Yup from 'yup';
import { Formik, Form, useField } from 'formik';

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
    MenuItem,
    styled,
    Tooltip,
} from '@mui/material';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';

// Icons
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const validationSchema = Yup.object().shape({
    area: Yup.string().required('Campo requerido'),
    tipo: Yup.string().required('Campo requerido'),
    subtipo: Yup.string().required('Campo requerido'),
    nombre: Yup.string().required('Campo requerido'),
    version: Yup.string().required('Campo requerido'),
    // archivo: Yup.string().required("Campo requerido"),
});

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
                sx={{ width: '270px' }}
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
                sx={{ width: '270px' }}
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

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const Sgc = () => {
    const hiddenFileInput = useRef(null);
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileUpdate, setSelectedFileUpdate] = useState(null);
    const [fileName, setFileName] = useState('Cargar Archivo');
    const [loading, setLoading] = useState(false);
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    const editPermission = permissions.includes('sgc.change_sgcfile');
    const deletePermission = permissions.includes('sgc.delete_sgcfile');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getFiles = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${getApiUrl().apiUrl}sgc/`, {
                method: 'GET',
                credentials: 'include',
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setRows(data.objects);
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
        getFiles();
    }, []);

    const handleDownloadFile = (file) => {
        window.open(file, '_blank');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFileName('Cargar Archivo');
        setSelectedFile(null);
    };
    const handleOpenDialog = () => setOpenDialog(true);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const handleEditClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleCancelClick = (id) => () => {
        setSelectedFileUpdate(null);
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}sgc/${id}`, {
                method: 'delete',
                credentials: 'include',
            });

            await handleError(response, showSnack);
            if (response.status === 204) {
                setRows(rows.filter((row) => row.id !== id));
                getFiles();
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

    const processRowUpdate = async (newRow) => {
        const formData = new FormData();
        formData.append('area', newRow.area);
        formData.append('type', newRow.type);
        formData.append('sub_type', newRow.sub_type);
        formData.append('name', newRow.name);
        formData.append('version', newRow.version);
        console.log(selectedFileUpdate);
        if (selectedFileUpdate) {
            formData.append('file', selectedFileUpdate);
        }

        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}sgc/${newRow.id}/`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData,
                }
            );

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                getFiles();
                showSnack(
                    'success',
                    'El archivo ha sido actualizado correctamente.'
                );
                return data;
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        } finally {
            setSelectedFileUpdate(null);
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleProcessRowUpdateError = useCallback((error) => {
        console.error(error);
        showSnack('error', error.message, true);
        // setSnackbar({ children: error.message, severity: "error" });
    }, []);

    const handleClickFile = () => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = (event) => {
        showSnack(
            'info',
            'El archivo ha sido cargado correctamente. Selecciona guardar para actualizar el registro.'
        );
        setSelectedFileUpdate(event.target.files[0]);
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: 'sgc',
                        delimiter: ';',
                        utf8WithBom: true,
                    }}
                />
                {permissions && permissions.includes('sgc.add_sgcfile') ? (
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
        const formData = new FormData();
        formData.append('area', values.area);
        formData.append('type', values.tipo);
        formData.append('sub_type', values.subtipo);
        formData.append('name', values.nombre);
        formData.append('version', values.version);
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${getApiUrl().apiUrl}sgc/`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            await handleError(response, showSnack);

            if (response.status === 201) {
                handleCloseDialog();
                getFiles();
                showSnack('success', 'Se ha cargado el archivo correctamente.');
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        } finally {
            setFileName('Cargar Archivo');
            setSelectedFile(null);
        }
    };

    const handleFileInputChange = (event) => {
        setFileName(event.target.files[0].name);
        setSelectedFile(event.target.files[0]);
    };

    const areas = [
        { value: 'GESTION TECNOLOGICA', label: 'GT' },
        { value: 'GESTION HUMANA', label: 'GH' },
        { value: 'DIRECCIONAMIENTO ESTRATEGICO', label: 'DE' },
        { value: 'GESTION DE PROCESOS', label: 'GP' },
        { value: 'GESTION CARTERA', label: 'GC' },
        { value: 'GESTION CARTERA ENEL', label: 'GCE' },
        { value: 'GESTION ADMINISTRATIVA', label: 'GA' },
        { value: 'GESTION LEGAL', label: 'GL' },
        { value: 'GESTION DE INVESTIGACION', label: 'GI' },
        { value: 'CONTROL INTERNO', label: 'CI' },
        { value: 'GESTION DE SERVICIO', label: 'GS' },
        {
            value: 'SISTEMA DE GESTION DE SEGURIDAD Y SALUD EN EL TRABAJO',
            label: 'SST-GA',
        },
    ];

    const tipos = [
        { value: 'P', label: 'P' },
        { value: 'PR', label: 'PR' },
        { value: 'PL', label: 'PL' },
        { value: 'RG', label: 'RG' },
        { value: 'MA', label: 'MA' },
        { value: 'IN', label: 'IN' },
        { value: 'CR', label: 'CR' },
    ];

    const columns = [
        {
            field: 'area',
            headerName: 'Area',
            width: 75,
            type: 'singleSelect',
            editable: editPermission,
            valueOptions: areas,
        },

        {
            field: 'type',
            headerName: 'Tipo',
            width: 70,
            type: 'singleSelect',
            editable: editPermission,
            valueOptions: ['CR', 'IN', 'MA', 'P', 'PL', 'PR', 'RG'],
        },
        {
            field: 'sub_type',
            headerName: 'Subtipo',
            width: 100,
            editable: editPermission,
        },
        {
            field: 'name',
            headerName: 'Nombre',
            width: editPermission ? 630 : 680,
            editable: editPermission,
        },
        {
            field: 'version',
            headerName: 'Version',
            width: 70,
            editable: editPermission,
        },
        {
            field: 'file',
            headerName: 'Archivo',
            width: 80,
            type: 'actions',
            cellClassName: 'actions',
            getActions: (GridRowParams) => {
                const isInEditMode =
                    rowModesModel[GridRowParams.id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <Fragment key={`upload-${GridRowParams.id}`}>
                            <input
                                type="file"
                                accept=".docx, .pdf, .xlsx, .pptx, .doc"
                                ref={hiddenFileInput}
                                onChange={(event) => handleFileChange(event)}
                                style={{ display: 'none' }}
                            />
                            <GridActionsCellItem
                                icon={<UploadFileIcon />}
                                label="upload"
                                sx={{
                                    color: 'primary.main',
                                }}
                                onClick={() =>
                                    handleClickFile(GridRowParams.id)
                                }
                            />
                        </Fragment>,
                    ];
                }

                return [
                    <Tooltip
                        key={`tooltip-${GridRowParams.id}`}
                        title="Descargar Archivo"
                    >
                        <GridActionsCellItem
                            icon={<FileDownloadIcon />}
                            label="download"
                            onClick={() =>
                                handleDownloadFile(GridRowParams.row.file)
                            }
                            sx={{
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        />
                    </Tooltip>,
                ];
            },
        },
    ];

    if (editPermission || deletePermission) {
        columns.push({
            field: 'actions',
            headerName: 'Acciones',
            width: 100,
            type: 'actions',
            cellClassName: 'actions',
            getActions: ({ row }) => {
                const isInEditMode =
                    rowModesModel[row.id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <Tooltip
                            key={`tooltip-${row.id}`}
                            title="Guardar Cambios"
                        >
                            <GridActionsCellItem
                                sx={{
                                    transition: '.3s ease',
                                    '&:hover': { color: 'green' },
                                }}
                                icon={<SaveIcon />}
                                label="Save"
                                onClick={handleSaveClick(row.id)}
                            />
                        </Tooltip>,
                        <Tooltip
                            key={`tooltip-${row.id}`}
                            title="Cancelar Cambios"
                        >
                            <GridActionsCellItem
                                icon={<CancelIcon />}
                                label="Cancel"
                                className="textPrimary"
                                onClick={handleCancelClick(row.id)}
                                sx={{
                                    transition: '.3s ease',
                                    '&:hover': { color: 'red' },
                                }}
                            />
                        </Tooltip>,
                    ];
                }

                if (editPermission && deletePermission) {
                    return [
                        <Tooltip
                            key={`tooltip-${row.id}`}
                            title="Editar Registro"
                        >
                            <GridActionsCellItem
                                sx={{
                                    transition: '.3s ease',
                                    '&:hover': { color: 'primary.main' },
                                }}
                                icon={<EditIcon />}
                                label="Editar"
                                onClick={handleEditClick(row.id)}
                            />
                        </Tooltip>,
                        <Tooltip
                            key={`tooltip-${row.id}`}
                            title="Eliminar Registro"
                        >
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
                } else if (editPermission && !deletePermission) {
                    <Tooltip title="Editar Registro">
                        <GridActionsCellItem
                            sx={{
                                transition: '.3s ease',
                                '&:hover': { color: 'primary.main' },
                            }}
                            icon={<EditIcon />}
                            label="Editar"
                            onClick={handleEditClick(id)}
                        />
                    </Tooltip>;
                } else if (!editPermission && deletePermission) {
                    <Tooltip title="Eliminar Registro">
                        <GridActionsCellItem
                            sx={{
                                transition: '.3s ease',
                                '&:hover': { color: 'red' },
                            }}
                            icon={<DeleteIcon />}
                            label="Eliminar"
                            onClick={() => handleDeleteClick(id)}
                        />
                        ,
                    </Tooltip>;
                } else {
                    return [];
                }
            },
        });
        const nombreColumn = columns.find(
            (column) => column.field === 'nombre'
        );
        if (nombreColumn) {
            nombreColumn.width -= 100; // Adjust the width as needed
        }
    }

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
                    Gestión Documental
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
                        editMode="row"
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
                        rowModesModel={rowModesModel}
                        onRowEditStop={handleRowEditStop}
                        onRowModesModelChange={handleRowModesModelChange}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={handleProcessRowUpdateError}
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
                fullWidth={true}
                maxWidth="md"
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Cargar nuevo archivo</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            area: '',
                            tipo: '',
                            subtipo: '',
                            nombre: '',
                            version: '',
                            file: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '.5rem',
                                        pt: '0.5rem',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <FormikTextField
                                        type="select"
                                        options={areas}
                                        name="area"
                                        label="Area"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <FormikTextField
                                        type="select"
                                        options={tipos}
                                        name="tipo"
                                        label="Tipo"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <FormikTextField
                                        type="text"
                                        name="subtipo"
                                        label="Subtipo"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <FormikTextField
                                        type="text"
                                        name="nombre"
                                        label="Nombre"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <FormikTextField
                                        type="text"
                                        name="version"
                                        label="Version"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            height: '56px',
                                            justifyContent: 'center',
                                            width: '270px',
                                        }}
                                    >
                                        <Button
                                            sx={{
                                                width: '100%',
                                                overflow: 'hidden',
                                            }}
                                            variant="outlined"
                                            component="label"
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            {fileName}
                                            <VisuallyHiddenInput
                                                id="file"
                                                name="file"
                                                type="file"
                                                accept=".pdf, .xlsx"
                                                onChange={
                                                    handleFileInputChange
                                                    // Formik doesn't automatically handle file inputs, so we need to manually
                                                    // update the 'file' field when a file is selected
                                                    // formik.setFieldValue("file", event.currentTarget.files[0]);
                                                }
                                            />
                                        </Button>
                                    </Box>
                                </Box>
                                <Button
                                    type="submit"
                                    startIcon={<SaveIcon></SaveIcon>}
                                >
                                    Guardar
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Sgc;
