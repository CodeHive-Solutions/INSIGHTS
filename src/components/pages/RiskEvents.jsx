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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const validationSchema = Yup.object().shape({
    id: Yup.string().required("Campo requerido"),
    start_date: Yup.string().required("Campo requerido"),
    end_date: Yup.string().required("Campo requerido"),
    event_type: Yup.string().required("Campo requerido"),
    process: Yup.string().required("Campo requerido"),
    lost_type: Yup.string().required("Campo requerido"),
    product_line: Yup.string().required("Campo requerido"),
    current_state: Yup.string().required("Campo requerido"),
    close_date: Yup.string().required("Campo requerido"),
    reported_by: Yup.string().required("Campo requerido"),
    classification: Yup.string().required("Campo requerido"),
    level: Yup.string().required("Campo requerido"),
    plan: Yup.string().required("Campo requerido"),
    learning: Yup.string().required("Campo requerido"),
});

export const RiskEvent = () => {
    const [rows, setRows] = useState([]);
    const isPresent = useIsPresent();
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [details, setDetails] = useState({});
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem("permissions"));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions.includes("contracts.view_contract")) {
            navigate("/logged/home");
        }
    }, []);

    const getPolicies = async () => {
        try {
            const response = await fetch(`${getApiUrl()}operational-risk/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail);
            } else if (response.status === 200) {
                setRows(data);
                // setAddPermission(data.permissions.add);
                // setEditPermission(data.permissions.change);
                // setDeletePermission(data.permissions.delete);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    const getDetails = async (id) => {
        try {
            const response = await fetch(`${getApiUrl()}contracts/${id}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail);
            } else if (response.status === 200) {
                setDetails(data);
                handleOpenDialogEdit();
                // setAddPermission(data.permissions.add);
                // setEditPermission(data.permissions.change);
                // setDeletePermission(data.permissions.delete);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    useEffect(() => {
        getPolicies();
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
            const response = await fetch(`${getApiUrl()}operational-risk/${id}`, {
                method: "delete",
                credentials: "include",
            });
            if (response.status === 204) {
                setRows(rows.filter((row) => row.id !== id));
                getPolicies();
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
                {permissions.includes("contracts.add_contract") ? (
                    <Button size="small" onClick={handleOpenDialog} startIcon={<PersonAddAlt1Icon />}>
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
        const formatCOPValue = (value) => {
            return value.replace(/\./g, "").replace(",", ".");
        };

        const formatCOPFields = (values) => {
            const fieldsToFormat = ["value", "monthly_cost", "insurance_policy"];

            fieldsToFormat.forEach((field) => {
                if (values[field]) {
                    values[field] = formatCOPValue(values[field]);
                }
            });
        };

        formatCOPFields(values);

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
                getPolicies();
                showSnack("success", "Se ha creado el registro correctamente.");
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    const handleSubmitEdit = async (values) => {
        const formatCOPValue = (value) => {
            return value.replace(/\./g, "").replace(",", ".");
        };

        const formatCOPFields = (values) => {
            const fieldsToFormat = ["value", "monthly_cost", "insurance_policy"];

            fieldsToFormat.forEach((field) => {
                if (values[field]) {
                    values[field] = formatCOPValue(values[field]);
                }
            });
        };

        formatCOPFields(values);
        try {
            const response = await fetch(`${getApiUrl()}contracts/${values.id}/`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail);
            } else if (response.status === 200) {
                handleCloseDialogEdit();
                getPolicies();
                showSnack("success", "Se ha actualizado el registro correctamente.");
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    const FormikTextField = ({ label, type, options, multiline, rows, ...props }) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : "";
        if (type === "select") {
            return (
                <TextField sx={{ width: "390px" }} select label={label} {...field} helperText={errorText} error={!!errorText}>
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );
        } else if (label === "Renovación del contrato") {
            return (
                <TextField
                    sx={{ width: "800px" }}
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
        } else if (type === "date" || type === "datetime-local") {
            return (
                <TextField
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "390px" }}
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
                    sx={{ width: "800px" }}
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
                    sx={{ width: "390px" }}
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
        { field: "id", type: "number", headerName: "ID", width: 70 },
        { field: "start_date", type: "datetime-local", headerName: "Fecha de Inicio", width: 100, editable: false },
        { field: "end_date", type: "datetime-local", headerName: "Fecha de Fin", width: 100, editable: false },
        {
            field: "event_type",
            type: "select",
            headerName: "Tipo de Evento",
            width: 100,
            editable: false,
            options: [
                { value: "FRAUDE INTERNO", label: "Fraude Interno" },
                { value: "FRAUDE EXTERNO", label: "Fraude Externo" },
                { value: "RELACIONES LABORALES", label: "Relaciones Laborales" },
                { value: "CLIENTES", label: "Clientes" },
                { value: "DAÑOS ACTIVOS FISICOS", label: "Daños Activos Físicos" },
                { value: "FALLAS TECNOLOGICAS", label: "Fallas Tecnológicas" },
                { value: "EJECUCION Y ADMINISTRACION DE PROCESOS", label: "Ejecución y Administración de Procesos" },
                { value: "AGENTES EXTERNOS", label: "Agentes Externos" },
            ],
        },
        {
            field: "process",
            type: "select",
            headerName: "Proceso",
            width: 100,
            editable: false,
            options: [
                { value: "ADMINISTRATIVO, INVERSIONES Y TESORERIA", label: "Administrativo, Inversiones y Tesorería" },
                { value: "BANCOS Y CUENTAS POR PAGAR", label: "Bancos y Cuentas por Pagar" },
                { value: "CAMPAÑAS", label: "Campañas" },
                { value: "CONTABILIDAD", label: "Contabilidad" },
                { value: "IMPUESTOS", label: "Impuestos" },
                { value: "PERSONAL Y NOMINA", label: "Personal y Nomina" },
                { value: "PLANEACION Y ESTRATEGIA", label: "Plantación y Estrategica" },
                { value: "SERVICIOS GENERALES", label: "Servicios Generales" },
                { value: "SISTEMAS", label: "Sistemas" },
                { value: "VISITADORES", label: "Visitadores" },
            ],
        },
        {
            field: "lost_type",
            type: "select",
            headerName: "Tipo de Perdida",
            width: 100,
            editable: false,
            options: [
                { value: "GENERAN PERDIDAS Y AFECTAN EL PYG", label: "Generan Perdidas y Afectan el PYG" },
                { value: "GENERAN PERDIDAS Y NO AFECTAN EL PYG", label: "Generan Perdidas y no Afectan el PYG" },
                { value: "NO GENERAN PERDIDA Y NO AFECTAN EL PYG", label: "No Generan Perdida y no Afectan el PYG" },
            ],
        },
        {
            field: "product",
            type: "",
            headerName: "Producto",
            width: 100,
            editable: false,
            options: [
                { value: "AVANTEL", label: "Avantel" },
                { value: "AZTECA", label: "Azteca" },
                { value: "BANCO AGRARIO", label: "Banco Agrario" },
                { value: "BAYPORT", label: "BayPort" },
                { value: "CLARO", label: "Claro" },
                { value: "CLARO VENTAS", label: "Claro Ventas" },
                { value: "CONGENTE", label: "Congente" },
                { value: "COOMEVA", label: "Coomeva" },
                { value: "FALABELLA", label: "Falabella" },
                { value: "GERENCIA ADMINISTRATIVA", label: "Gerencia Administrativa" },
                { value: "LEGAL Y RIESGO", label: "Legal y Riesgo" },
                { value: "METLIFE", label: "Metlife" },
                { value: "NUEVA EPS", label: "Nueva EPS" },
                { value: "PAYU", label: "PayU" },
                { value: "QUALITY", label: "Quality" },
                { value: "RECURSOS FISICOS", label: "Recursos Fisicos" },
                { value: "RRHH", label: "RRHH" },
                { value: "SCOTIABANK COLPATRIA", label: "Scotiabank Colpatria" },
                { value: "TECNOLOGIA", label: "Tecnologia" },
                { value: "TODOS", label: "Todos" },
                { value: "YANBAL", label: "Yanbal" },
            ],
        },
        {
            field: "status",
            type: "",
            headerName: "Estado Actual",
            width: 100,
            editable: false,
            options: [
                { value: "ABIERTO", label: "Abierto" },
                { value: "CERRADO", label: "Cerrado" },
            ],
        },
        { field: "close_date", type: "", headerName: "Fecha de Cierre", width: 100, editable: false },
        { field: "reported_by", type: "", headerName: "Reportado", width: 100, editable: false },
        {
            field: "classification",
            type: "",
            headerName: "Clasificación",
            width: 100,
            editable: false,
            options: [
                { value: "CRITICO", label: "Critico" },
                { value: "NO CRITICO", label: "No Critico" },
            ],
        },
        {
            field: "level",
            type: "",
            headerName: "Nivel",
            width: 100,
            editable: false,
            options: [
                { value: "BAJO", label: "Bajo" },
                { value: "MEDIO", label: "Medio" },
                { value: "ALTO", label: "Alto" },
            ],
        },
        { field: "plan", type: "", headerName: "Plan", width: 100, editable: false },
        { field: "learning", type: "", headerName: "Aprendizaje", width: 100, editable: false },
    ];

    const initialValues = columns.reduce((acc, column) => {
        // Define initial values based on field type
        if (column.type === "datetime-local") {
            acc[column.field] = ""; // Set initial datetime-local value
        } else if (column.type === "select") {
            acc[column.field] = column.options[0].value; // Set initial select value
        } else {
            acc[column.field] = ""; // Set initial text value
        }

        return acc;
    }, {});

    columns.push({
        field: "actions",
        headerName: "Acciones",
        width: 100,
        type: "actions",
        cellClassName: "actions",
        getActions: ({ id }) => {
            return [
                <Tooltip title="Mas Detalles">
                    <GridActionsCellItem
                        onClick={() => getDetails(id)}
                        sx={{ transition: ".3s ease", "&:hover": { color: "primary.main" } }}
                        icon={<MoreHorizIcon />}
                        label="Detalles"
                    />
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
                    Eventos de Riesgo Operativo
                </Typography>
                <DataGrid
                    sx={{ width: "100%" }}
                    columns={columns}
                    rows={rows}
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
            <Dialog maxWidth={"md"} open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Añadir un nuevo registro</DialogTitle>
                <DialogContent>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        <Form>
                            <Box sx={{ display: "flex", gap: "1rem", pt: "0.5rem", flexWrap: "wrap" }}>
                                {columns.map((column) => {
                                    if (column.field === "actions") {
                                        return null;
                                    } else if (column.field === "id") {
                                        return null;
                                    } else if (column.field === "start_date" || column.field === "end_date") {
                                        return <FormikTextField type="datetime-local" name={column.field} label={column.headerName} />;
                                    } else if (column.field === "close_date") {
                                        return <FormikTextField type="date" name={column.field} label={column.headerName} />;
                                    } else if (column.field === "renovation_date") {
                                        return <FormikTextField type="date" name={column.field} label={column.headerName} />;
                                    } else if (
                                        column.field === "event_type" ||
                                        column.field === "process" ||
                                        column.field === "lost_type" ||
                                        column.field === "product" ||
                                        column.field === "status" ||
                                        column.field === "level" ||
                                        column.field === "classification"
                                    ) {
                                        return (
                                            <FormikTextField
                                                type="select"
                                                name={column.field}
                                                label={column.headerName}
                                                select
                                                autoComplete="off"
                                                spellCheck={false}
                                                options={column.options}
                                            ></FormikTextField>
                                        );
                                    } else {
                                        return <FormikTextField type="text" name={column.field} label={column.headerName} autoComplete="off" spellCheck={false} />;
                                    }
                                })}
                            </Box>
                        </Form>
                    </Formik>
                </DialogContent>
            </Dialog>

            <Dialog maxWidth={"md"} open={openDialogEdit} onClose={handleCloseDialogEdit}>
                <DialogTitle sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                    <Box>Detalles del registro</Box>
                    <IconButton sx={{ color: "primary.main" }} aria-label="edit" onClick={handleDisabledChange}>
                        <ModeEditIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Formik initialValues={details} validationSchema={validationSchema} onSubmit={handleSubmitEdit}>
                        <Form>
                            <Box sx={{ display: "flex", gap: "1rem", pt: "0.5rem", flexWrap: "wrap" }}>
                                <FormikTextField type="datetime" name="name" label="Clientes" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="city" label="Ciudad" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="description" label="Descripción" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="date" name="expected_start_date" label="Fecha de Inicio Estimada" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="value" label="Valor del Contrato" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="monthly_cost" label="Facturación Mensual" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="date" name="duration" label="Duración" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="contact" label="Contacto" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="text" name="contact_telephone" label="Teléfono" autoComplete="off" spellCheck={false} />
                                <FormikTextField type="date" name="start_date" label="Fecha de Inicio" autoComplete="off" spellCheck={false} />
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
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
                                <Button disabled={disabled} type="submit" startIcon={<SaveIcon></SaveIcon>}>
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

export default RiskEvent;
