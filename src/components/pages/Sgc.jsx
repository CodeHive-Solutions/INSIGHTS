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
    archivo: Yup.string().required("Campo requerido"),
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

export const Sgc = () => {
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState(initialRows);
    const hiddenFileInput = useRef(null);
    const isPresent = useIsPresent();
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [editAccess, setEditAccess] = useState(true);
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCloseDialog = () => setOpenDialog(false);
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

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        showSnack("success", "Se ha actualizado la fila correctamente.");
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleProcessRowUpdateError = useCallback((error) => {
        console.log(error);
        showSnack("error", error.message, true);
        // setSnackbar({ children: error.message, severity: "error" });
    }, []);

    const handleClickFile = (id) => {
        hiddenFileInput.current.click();
        console.log(id);
    };

    const handleFileChange = (event) => {
        const fileUploaded = event.target.files[0];
        // Now you can use the fileUploaded object for further processing
        console.log(fileUploaded);
        showSnack("success", "Se ha cargado el archivo correctamente.");
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
                <Button onClick={handleOpenDialog} startIcon={<PersonAddAlt1Icon />}>
                    AÑADIR
                </Button>
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    const handleSubmit = (values, { setSubmitting }) => {
        console.log(values);
    };

    const areas = [
        { value: "DE", label: "DE" },
        { value: "GA", label: "GA" },
        { value: "GC", label: "GC" },
        { value: "GH", label: "GH" },
        { value: "GL", label: "GL" },
        { value: "GP", label: "GP" },
        { value: "GR", label: "GR" },
        { value: "GS", label: "GS" },
        { value: "GT", label: "GT" },
        { value: "SG-SST", label: "SG-SST" },
    ];

    const tipos = [
        { value: "CR", label: "CR" },
        { value: "IN", label: "IN" },
        { value: "MA", label: "MA" },
        { value: "P", label: "P" },
        { value: "PL", label: "PL" },
        { value: "PR", label: "PR" },
        { value: "RG", label: "RG" },
    ];

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "area",
            headerName: "Area",
            width: 70,
            type: "singleSelect",
            editable: editAccess,
            valueOptions: ["DE", "GA", "GC", "GH", "GL", "GP", "GR", "GS", "GT", "SG-SST"],
        },

        { field: "tipo", headerName: "Tipo", width: 70, type: "singleSelect", editable: editAccess, valueOptions: ["CR", "IN", "MA", "P", "PL", "PR", "RG"] },
        { field: "subtipo", headerName: "Subtipo", width: 70, editable: editAccess },
        { field: "nombre", headerName: "Nombre", width: 700, editable: editAccess },
        { field: "version", headerName: "Version", width: 70, editable: editAccess },
        {
            field: "archivo",
            headerName: "Archivo",
            width: 80,
            type: "actions",
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <>
                            <input type="file" ref={hiddenFileInput} onChange={handleFileChange} style={{ display: "none" }} />
                            <GridActionsCellItem
                                icon={<UploadFileIcon />}
                                label="Save"
                                sx={{
                                    color: "primary.main",
                                }}
                                onClick={() => handleClickFile(id)}
                            />
                        </>,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<FileDownloadIcon />}
                        label="Save"
                        sx={{
                            color: "primary.main",
                        }}
                    />,
                ];
            },
        },
    ];

    if (editAccess) {
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

                return [
                    <GridActionsCellItem icon={<EditIcon />} label="Editar" onClick={handleEditClick(id)} />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Eliminar" onClick={handleDeleteClick(id)} />,
                ];
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
                    Sistema de Gestión de Calidad
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
                    <Formik initialValues={{ area: "", tipo: "", subtipo: "", nombre: "", version: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        <Form>
                            <Box sx={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                                <FormikTextField type="select" options={areas} name="area" label="Area" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="select" options={tipos} name="tipo" label="Tipo" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="subtipo" label="Subtipo" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="nombre" label="Nombre" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="version" label="Version" autoComplete="off" spellCheck={false} />
                                <Box sx={{ display: "flex", height: "56px", justifyContent: "center", width: "270px" }}>
                                    <Button sx={{ width: "100%" }} variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                                        Cargar archivo
                                        <VisuallyHiddenInput type="file" />
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{ pl: "0.5rem" }}>
                                <Button startIcon={<SaveIcon></SaveIcon>}>Guardar</Button>
                            </Box>
                        </Form>
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Sgc;
