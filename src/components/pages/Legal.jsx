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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Tooltip } from "@mui/material";

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
    name: Yup.string().required("Campo requerido"),
    city: Yup.string().required("Campo requerido"),
    description: Yup.string().required("Campo requerido"),
    expected_start_date: Yup.string().required("Campo requerido"),
    value: Yup.string().required("Campo requerido"),
    monthly_cost: Yup.string().required("Campo requerido"),
    duration: Yup.string().required("Campo requerido"),
    contact: Yup.string().required("Campo requerido"),
    contact_telephone: Yup.string().required("Campo requerido"),
    start_date: Yup.string().required("Campo requerido"),
    civil_responsibility_policy: Yup.string().required("Campo requerido"),
    compliance_policy: Yup.string().required("Campo requerido"),
    insurance_policy: Yup.string().required("Campo requerido"),
    renovation_date: Yup.string().required("Campo requerido"),
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
    } else if (type === "date") {
        return (
            <TextField
                InputLabelProps={{ shrink: true }}
                sx={{ width: "270px" }}
                rows={rows}
                type={type}
                label={label}
                {...field}
                helperText={errorText}
                error={!!errorText}
            />
        );
    } else if (multiline) {
        return <TextField sx={{ width: "600px" }} multiline={multiline} rows={rows} type={type} label={label} {...field} helperText={errorText} error={!!errorText} />;
    } else {
        return <TextField sx={{ width: "270px" }} multiline={multiline} rows={rows} type={type} label={label} {...field} helperText={errorText} error={!!errorText} />;
    }
};

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
    const [rows, setRows] = useState(initialRows);
    const isPresent = useIsPresent();
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [addPermission, setAddPermission] = useState(false);
    const [deletePermission, setDeletePermission] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

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

    // useEffect(() => {
    //     getFiles();
    // }, []);

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

    const handleDeleteClick = async (id) => {
        try {
            const response = await fetch(`${getApiUrl()}contact/${id}`, {
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

    const handleSubmit = async (values) => {
        try {
            const response = await fetch(`${getApiUrl()}contracts/`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail);
            } else if (response.status === 201) {
                handleCloseDialog();
                showSnack("success", "Se ha cargado el archivo correctamente.");
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
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
        { field: "name", headerName: "Clientes", width: 750, editable: false },
        { field: "city", headerName: "Ciudad", width: 100, editable: false },
        { field: "description", headerName: "Descripción", width: 100, editable: false },
        { field: "expected_date", headerName: "Fecha de Inicio Estimada", width: 100, editable: false },
        { field: "value", headerName: "Valor del Contrato", width: 100, editable: false },
        { field: "monthly_cost", headerName: "Facturación Mensual", width: 100, editable: false },
        { field: "duration", headerName: "Duración", width: 100, editable: false },
        { field: "contact", headerName: "Contacto", width: 100, editable: false },
        { field: "contact_telephone", headerName: "Teléfono", width: 100, editable: false },
        { field: "start_date", headerName: "Fecha Inicio", width: 100, editable: false },
        {
            field: "civil_responsibility_policy",
            headerName: "Pólizas de Responsabilidad Civil Extracontractual Derivada de Cumplimiento",
            width: 100,
            editable: false,
        },
        { field: "compliance_policy", headerName: "Póliza de Cumplimiento", width: 100, editable: false },
        {
            field: "insurance_policy",
            headerName: "Póliza Seguros de Responsabilidad Profesional por Perdida de Datos",
            width: 100,
            editable: false,
        },
        { field: "renovation_date", headerName: "Renovación del Contrato", width: 100, editable: false },
    ];

    columns.push({
        field: "actions",
        headerName: "Acciones",
        width: 100,
        type: "actions",
        cellClassName: "actions",
        getActions: ({ id }) => {
            return [
                <Tooltip title="Mas Detalles">
                    <GridActionsCellItem sx={{ transition: ".3s ease", "&:hover": { color: "primary.main" } }} icon={<MoreHorizIcon />} label="Detalles" />
                </Tooltip>,
                <Tooltip title="Eliminar Registro">
                    <GridActionsCellItem
                        sx={{ transition: ".3s ease", "&:hover": { color: "red" } }}
                        icon={<DeleteIcon />}
                        label="Eliminar"
                        onClick={() => handleDeleteClick(id)}
                    />
                </Tooltip>,
            ];
        },
    });

    const nombreColumn = columns.find((column) => column.field === "nombre");
    if (nombreColumn) {
        nombreColumn.width -= 100; // Adjust the width as needed
    }
    const hiddenColumns = columns.map((column) => column.field);

    const columnVisibilityModel = {
        ...Object.fromEntries(hiddenColumns.map((field) => [field, false])),
        id: true,
        name: true,
        duration: true,
        start_date: true,
        actions: true,
    };

    const createInitialState = {
        filter: {
            filterModel: {
                items: [],
                quickFilterExcludeHiddenColumns: true,
            },
        },
        pagination: {
            paginationModel: {
                pageSize: 12,
            },
        },
        columns: {
            columnVisibilityModel: columnVisibilityModel,
        },
    };

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
                    Contratos y Pólizas Legales
                </Typography>
                <DataGrid
                    sx={{ width: "100%" }}
                    columns={columns}
                    rows={rows}
                    initialState={createInitialState}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
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
            <Dialog fullWidth={true} maxWidth="200px" open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Añadir un nuevo registro</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: "",
                            city: "",
                            description: "",
                            expected_start_date: "",
                            value: "",
                            monthly_cost: "",
                            duration: "",
                            contact: "",
                            contact_telephone: "",
                            start_date: "",
                            civil_responsibility_policy: "",
                            compliance_policy: "",
                            insurance_policy: "",
                            renovation_date: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <Box sx={{ display: "flex", gap: "1rem", pt: "0.5rem", flexWrap: "wrap" }}>
                                <FormikTextField type="text" name="name" label="Clientes" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="city" label="Ciudad" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="description" label="Descripción" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="date" name="expected_start_date" label="Fecha de Inicio Estimada" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="value" label="Valor del Contrato" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="monthly_cost" label="Facturación Mensual" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="date" name="duration" label="Duración" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="contact" label="Contacto" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="contact_telephone" label="Teléfono" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="date" name="start_date" label="Fecha de Inicio" autoComplete="off" spellCheck={false} />
                                <Box>
                                    <FormikTextField
                                        type="text"
                                        multiline={true}
                                        rows={3}
                                        name="civil_responsibility_policy"
                                        label="Pólizas de Responsabilidad Civil Extracontractual Derivada de Cumplimiento"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <FormikTextField
                                        multiline={true}
                                        rows={3}
                                        type="text"
                                        name="compliance_policy"
                                        label="Póliza de Cumplimiento"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <FormikTextField
                                        type="text"
                                        multiline={true}
                                        rows={3}
                                        name="insurance_policy"
                                        label="Póliza Seguros de Responsabilidad Profesional por Perdida de Datos"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                </Box>
                                <FormikTextField type="date" name="renovation_date" label="Renovación del contrato" autoComplete="off" spellCheck={false} />
                            </Box>
                            <Button type="submit" startIcon={<SaveIcon></SaveIcon>}>
                                Guardar
                            </Button>
                        </Form>
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Legal;
