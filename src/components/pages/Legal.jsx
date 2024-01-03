import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, useIsPresent } from "framer-motion";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import SnackbarAlert from "../common/SnackBarAlert";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import * as Yup from "yup";
import { Formik, Form, useField, useFormikContext } from "formik";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Save from "@mui/icons-material/Save";
import { getApiUrl } from "../../assets/getApi";

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
} from "@mui/x-data-grid";

// icons
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import "../../index.css";

const validationSchema = Yup.object().shape({
    area: Yup.string().required("Campo requerido"),
    tipo: Yup.string().required("Campo requerido"),
    subtipo: Yup.string().required("Campo requerido"),
    nombre: Yup.string().required("Campo requerido"),
    version: Yup.string().required("Campo requerido"),
    // archivo: Yup.string().required("Campo requerido"),
});

const FormikTextField = ({ label, type, options, multiline, rows, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    if (type === "select") {
        return (
            <TextField sx={{ width: "270px" }} defaultValue="" select type={type} label={label} {...field} helperText={errorText} error={!!errorText}>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        );
    } else {
        return <TextField sx={{ width: "270px" }} multiline={multiline} rows={rows} type={type} label={label} {...field} helperText={errorText} error={!!errorText} />;
    }
};

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const initialRows = [
    { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 2, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 3, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 4, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 5, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 6, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 7, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 8, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 9, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 10, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 11, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 12, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 13, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 14, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 15, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
];

export const Legal = () => {
    const hiddenFileInput = useRef(null);
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState(initialRows);
    const isPresent = useIsPresent();
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [addPermission, setAddPermission] = useState(false);
    const [editPermission, setEditPermission] = useState(false);
    const [deletePermission, setDeletePermission] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileUpdate, setSelectedFileUpdate] = useState(null);
    const [fileName, setFileName] = useState("Cargar Archivo");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getFiles = async () => {
        try {
            const response = await fetch(`${getApiUrl()}sgc/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail);
            } else if (response.status === 200) {
                setRows(data.objects);
                setAddPermission(data.permissions.add);
                setEditPermission(data.permissions.change);
                setDeletePermission(data.permissions.delete);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    useEffect(() => {
        getFiles();
    }, []);

    const handleDownloadFile = (id) => {
        window.open(`${getApiUrl()}services/file-download/sgc/${id}`);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFileName("Cargar Archivo");
        setSelectedFile(null);
    };
    const handleOpenDialog = () => setOpenDialog(true);

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
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
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await fetch(`${getApiUrl()}sgc/${id}`, {
                method: "delete",
                credentials: "include",
            });
            if (response.status === 204) {
                setRows(rows.filter((row) => row.id !== id));
                getFiles();
                showSnack("success", "Se ha eliminado el registro correctamente.");
            } else {
                showSnack("error", "Error al eliminar el registro");
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
            setSnackbarMessage("Error al eliminar la meta: " + error.message);
        }
    };

    const processRowUpdate = async (newRow) => {
        if (selectedFileUpdate) {
            const formData = new FormData();
            formData.append("file", selectedFileUpdate);
            formData.append("area", newRow.area);
            formData.append("type", newRow.type);
            formData.append("sub_type", newRow.sub_type);
            formData.append("name", newRow.name);
            formData.append("version", newRow.version);

            try {
                const response = await fetch(`${getApiUrl()}sgc/${newRow.id}/`, {
                    method: "PATCH",
                    credentials: "include",
                    body: formData,
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.detail);
                } else if (response.status === 200) {
                    getFiles();
                    showSnack("success", "El archivo ha sido actualizado correctamente.");
                    return data;
                }
            } catch (error) {
                console.error(error);
                showSnack("error", error.message);
            }
        } else {
            try {
                const response = await fetch(`${getApiUrl()}sgc/${newRow.id}/`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newRow),
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error(data);
                    throw new Error(response.statusText);
                } else if (response.status === 200) {
                    const data = await response.json();
                    getFiles();
                    showSnack("success", "El registro ha sido actualizado correctamente.");
                    return data;
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleProcessRowUpdateError = useCallback((error) => {
        console.error(error);
        showSnack("error", error.message, true);
        // setSnackbar({ children: error.message, severity: "error" });
    }, []);

    const handleClickFile = (id) => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = (id, event) => {
        showSnack("info", "El archivo ha sido cargado correctamente. Selecciona guardar para actualizar el registro.");
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
                        fileName: "Metas",
                        delimiter: ";",
                        utf8WithBom: true,
                    }}
                />
                {addPermission ? (
                    <Button onClick={handleOpenDialog} startIcon={<PersonAddAlt1Icon />}>
                        AÑADIR
                    </Button>
                ) : null}
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("area", values.area);
        formData.append("type", values.tipo);
        formData.append("sub_type", values.subtipo);
        formData.append("name", values.nombre);
        formData.append("version", values.version);
        formData.append("file", selectedFile);
        console.log(formData);

        try {
            const response = await fetch(`${getApiUrl()}sgc/`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail);
            } else if (response.status === 201) {
                handleCloseDialog();
                getFiles();
                showSnack("success", "Se ha cargado el archivo correctamente.");
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    const handleFileInputChange = (event) => {
        setFileName(event.target.files[0].name);
        setSelectedFile(event.target.files[0]);
    };

    const areas = [
        { value: "GESTION TECNOLOGICA", label: "GT" },
        { value: "GESTION HUMANA", label: "GH" },
        { value: "DIRECCIONAMIENTO ESTRATEGICO", label: "DE" },
        { value: "GESTION DE PROCESOS", label: "GP" },
        { value: "GESTION CARTERA", label: "GC" },
        { value: "GESTION ADMINISTRATIVA", label: "GA" },
        { value: "GESTION LEGAL", label: "GL" },
        { value: "GESTION RIESGO", label: "GR" },
        { value: "CONTROL INTERNO", label: "CI" },
        { value: "GESTION DE SERVICIO", label: "GS" },
        { value: "SISTEMA DE GESTION DE SEGURIDAD Y SALUD EN EL TRABAJO", label: "SST-GA" },
    ];

    const tipos = [
        { value: "P", label: "P" },
        { value: "PR", label: "PR" },
        { value: "PL", label: "PL" },
        { value: "RG", label: "RG" },
        { value: "MA", label: "MA" },
        { value: "IN", label: "IN" },
        { value: "CR", label: "CR" },
    ];

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "clients", headerName: "Clientes", width: 100, editable: editPermission },
        { field: "city", headerName: "Ciudad", width: 100, editable: editPermission },
        { field: "description", headerName: "Descripción", width: 100, editable: editPermission },
        { field: "expected_date", headerName: "Fecha de Inicio Estimada", width: 100, editable: editPermission },
        { field: "contract_value", headerName: "Valor del Contrato", width: 100, editable: editPermission },
        { field: "monthly_billing", headerName: "Facturación Mensual", width: 100, editable: editPermission },
        { field: "duration", headerName: "Duración", width: 100, editable: editPermission },
        { field: "contact", headerName: "Contacto", width: 100, editable: editPermission },
        { field: "number", headerName: "Teléfono", width: 100, editable: editPermission },
        { field: "start_date", headerName: "Fecha Inicio", width: 100, editable: editPermission },
        {
            field: "responsibility_policy_non_contractual",
            headerName: "Pólizas de Responsabilidad Civil Extracontractual Derivada de Cumplimiento",
            width: 100,
            editable: editPermission,
        },
        { field: "compliance_policy", headerName: "Póliza de Cumplimiento", width: 100, editable: editPermission },
        {
            field: "responsibility_policy_data_loss",
            headerName: "Póliza Seguros de Responsabilidad Profesional por Perdida de Datos",
            width: 100,
            editable: editPermission,
        },
        { field: "contract_renewal", headerName: "Renovación del Contrato", width: 100, editable: editPermission },
    ];

    if (editPermission || deletePermission) {
        columns.push({
            field: "actions",
            headerName: "Acciones",
            width: 100,
            type: "actions",
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            sx={{
                                color: "primary.main",
                            }}
                            color="inherit"
                        />,
                    ];
                }

                if (editPermission && deletePermission) {
                    return [
                        <GridActionsCellItem icon={<EditIcon />} label="Editar" onClick={handleEditClick(id)} />,
                        <GridActionsCellItem icon={<DeleteIcon />} label="Eliminar" onClick={() => handleDeleteClick(id)} />,
                    ];
                } else if (editPermission && !deletePermission) {
                    <GridActionsCellItem icon={<EditIcon />} label="Editar" onClick={handleEditClick(id)} />;
                } else if (!editPermission && deletePermission) {
                    <GridActionsCellItem icon={<DeleteIcon />} label="Eliminar" onClick={() => handleDeleteClick(id)} />;
                } else {
                    return [];
                }
            },
        });
        const nombreColumn = columns.find((column) => column.field === "nombre");
        if (nombreColumn) {
            nombreColumn.width -= 100; // Adjust the width as needed
        }
    }

    return (
        <>
            <Container
                sx={{
                    height: "85vh",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }} variant={"h4"}>
                    Contratos y Polizas Legales
                </Typography>
                <DataGrid
                    sx={{ width: "100%" }}
                    columns={columns}
                    rows={rows}
                    editMode="row"
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    rowModesModel={rowModesModel}
                    onRowEditStop={handleRowEditStop}
                    onRowModesModelChange={handleRowModesModelChange}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                ></DataGrid>
            </Container>
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
                exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
                style={{ originX: isPresent ? 0 : 1 }}
                className="privacy-screen"
            />
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
            <Dialog fullWidth={true} maxWidth="md" open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Cargar nuevo archivo</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{ area: "", tipo: "", subtipo: "", nombre: "", version: "", file: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(formik) => (
                            <Form>
                                <Box sx={{ display: "flex", gap: ".5rem", pt: "0.5rem", flexWrap: "wrap" }}>
                                    <FormikTextField type="select" options={areas} name="area" label="Area" autoComplete="off" spellCheck={false} />
                                    <FormikTextField type="select" options={tipos} name="tipo" label="Tipo" autoComplete="off" spellCheck={false} />
                                    <FormikTextField type="text" name="subtipo" label="Subtipo" autoComplete="off" spellCheck={false} />
                                    <FormikTextField type="text" name="nombre" label="Nombre" autoComplete="off" spellCheck={false} />
                                    <FormikTextField type="text" name="version" label="Version" autoComplete="off" spellCheck={false} />
                                    <Box sx={{ display: "flex", height: "56px", justifyContent: "center", width: "270px" }}>
                                        <Button sx={{ width: "100%", overflow: "hidden" }} variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
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
                                <Button type="submit" startIcon={<SaveIcon></SaveIcon>}>
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

export default Legal;
