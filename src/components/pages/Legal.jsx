import React, { useState, useEffect } from "react";
// Libraries
import { motion, useIsPresent } from "framer-motion";
import * as Yup from "yup";
import { Formik, Form, useField } from "formik";
import { useNavigate } from "react-router-dom";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";

// Material-UI
import { Container, Box, Button, Typography, TextField, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Divider, Chip } from "@mui/material";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridActionsCellItem,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";

// Icons
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo requerido"),
    city: Yup.string().required("Campo requerido"),
    description: Yup.string().required("Campo requerido"),
    expected_start_date: Yup.string().required("Campo requerido"),
    value: Yup.string()
        .typeError("Valores incorrectos")
        .required("Campo requerido")
        .matches(/^\d{1,3}(\.\d{3})*(,\d{1,2})?$/, "Formato incorrecto. Ejemplo válido: 100.000.000,09"),
    monthly_cost: Yup.string()
        .typeError("Valores incorrectos")
        .required("Campo requerido")
        .matches(/^\d{1,3}(\.\d{3})*(,\d{1,2})?$/, "Formato incorrecto. Ejemplo válido: 100.000.000,09"),
    duration: Yup.string().required("Campo requerido"),
    contact: Yup.string().required("Campo requerido"),
    contact_telephone: Yup.number().typeError("Numero de teléfono incorrecto").required("Campo requerido"),
    start_date: Yup.string().required("Campo requerido"),
    civil_responsibility_policy: Yup.string().required("Campo requerido"),
    civil_responsibility_policy_number: Yup.string().required("Campo requerido"),
    civil_responsibility_policy_start_date: Yup.string().required("Campo requerido"),
    civil_responsibility_policy_end_date: Yup.string().required("Campo requerido"),
    compliance_policy: Yup.string().required("Campo requerido"),
    compliance_policy_number: Yup.string().required("Campo requerido"),
    compliance_policy_start_date: Yup.string().required("Campo requerido"),
    compliance_policy_end_date: Yup.string().required("Campo requerido"),
    insurance_policy: Yup.string().required("Campo requerido"),
    insurance_policy_number: Yup.string().required("Campo requerido"),
    insurance_policy_start_date: Yup.string().required("Campo requerido"),
    insurance_policy_end_date: Yup.string().required("Campo requerido"),
    renovation_date: Yup.string().required("Campo requerido"),
});

const initialInputs = {
    clients: [
        { name: "name", label: "Clientes", type: "text" },
        { name: "city", label: "Ciudad", type: "text" },
        { name: "description", label: "Descripción", type: "text" },
        { name: "expected_start_date", label: "Fecha de Inicio Estimada", type: "date" },
        { name: "value", label: "Valor del Contrato", type: "text" },
        { name: "monthly_cost", label: "Facturación Mensual", type: "text" },
        { name: "duration", label: "Duración", type: "date" },
        { name: "contact", label: "Nombre del Contacto", type: "text" },
        { name: "contact_telephone", label: "Teléfono", type: "text" },
        { name: "start_date", label: "Fecha de Inicio", type: "date" },
    ],
    civilResponsibilityPolicy: [
        { name: "civil_responsibility_policy", label: "Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento", type: "text", multiline: true },
        { name: "civil_responsibility_policy_number", label: "Numero Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento", type: "text" },
        { name: "civil_responsibility_policy_start_date", label: "Fecha Inicio Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento", type: "date" },
        { name: "civil_responsibility_policy_end_date", label: "Fecha Fin Póliza de Responsabilidad Civil Extracontractual Derivada de Cumplimiento", type: "date" },
    ],
    compliancePolicy: [
        { name: "compliance_policy", label: "Póliza de Cumplimiento", type: "text", multiline: true },
        { name: "compliance_policy_number", label: "Numero Póliza de Cumplimiento", type: "text", multiline: true },
        { name: "compliance_policy_start_date", label: "Fecha Inicio Póliza de Cumplimiento", type: "date", multiline: true },
        { name: "compliance_policy_end_date", label: "Fecha Fin Póliza de Cumplimiento", type: "date", multiline: true },
    ],
    insurancePolicy: [
        { name: "insurance_policy", label: "Póliza Seguros de Responsabilidad Profesional por Perdida de Datos", type: "text", multiline: true },
        { name: "insurance_policy_number", label: "Numero Póliza Seguros de Responsabilidad Profesional por Perdida de Datos", type: "text", multiline: true },
        { name: "insurance_policy_start_date", label: "Fecha Inicio Póliza Seguros de Responsabilidad Profesional por Perdida de Datos", type: "date", multiline: true },
        { name: "insurance_policy_end_date", label: "Fecha Fin Póliza Seguros de Responsabilidad Profesional por Perdida de Datos", type: "date", multiline: true },
    ],
    renovation: [{ name: "renovation_date", label: "Renovación del contrato", type: "date" }],
};

export const Legal = () => {
    const initialValues = {
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
        civil_responsibility_policy_number: "",
        civil_responsibility_policy_start_date: "",
        civil_responsibility_policy_end_date: "",
        compliance_policy: "",
        compliance_policy_number: "",
        compliance_policy_start_date: "",
        compliance_policy_end_date: "",
        insurance_policy: "",
        insurance_policy_number: "",
        insurance_policy_start_date: "",
        insurance_policy_end_date: "",
        renovation_date: "",
    };

    const [rows, setRows] = useState([]);
    const isPresent = useIsPresent();
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [details, setDetails] = useState({});
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [inputs, setInputs] = useState(initialInputs);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const [newInitialValues, setNewInitialValues] = useState(initialValues);
    const [newValidationSchema, setNewValidationSchema] = useState(validationSchema);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes("contracts.view_contract")) {
            navigate("/logged/home");
        }
    }, []);

    const getPolicies = async () => {
        try {
            const response = await fetch(`${getApiUrl()}contracts/`, {
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

    useEffect(() => {
        getPolicies();
    }, []);

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
            const response = await fetch(`${getApiUrl()}contracts/${id}`, {
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
                        fileName: "contratos-pólizas-legales",
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

    const handleAddPolicies = (inputName, i, policyType, inputLabel) => {
        inputName = inputName.split("end")[0]; // Remove the index from the input name
        inputLabel = inputLabel.split("Fin ")[1]; // Remove the index from the input label

        const newInputs = [
            {
                name: `${inputName}_${i}`,
                label: `${i} ${inputLabel}`,
                type: "text",
                multiline: true,
            },
            {
                name: `${inputName}number_${i}`,
                label: `Numero ${inputLabel}`,
                type: "text",
                multiline: true,
            },
            {
                name: `${inputName}start_date_${i}`,
                label: `Fecha Inicio ${inputLabel}`,
                type: "date",
                multiline: true,
            },
            {
                name: `${inputName}end_date_${i}`,
                label: `Fecha Fin ${inputLabel}`,
                type: "date",
                multiline: true,
            },
        ];

        // Add the new inputs to the state inputs object in the correct position
        if (policyType === "civilResponsibilityPolicy") {
            setInputs({ ...inputs, civilResponsibilityPolicy: [...inputs.civilResponsibilityPolicy, ...newInputs] });
        } else if (policyType === "compliancePolicy") {
            setInputs({ ...inputs, compliancePolicy: [...inputs.compliancePolicy, ...newInputs] });
        } else {
            setInputs({ ...inputs, insurancePolicy: [...inputs.insurancePolicy, ...newInputs] });
        }

        const updatedInitialValues = {
            ...newInitialValues,
            [`${inputName}_${i}`]: "",
            [`${inputName}number_${i}`]: "",
            [`${inputName}start_date_${i}`]: "",
            [`${inputName}end_date_${i}`]: "",
        };

        console.log(updatedInitialValues);
        setNewInitialValues(updatedInitialValues);
        // Add the new inputs to the newInitialValues object

        // Add the new inputs to the newValidationSchema object
        const updatedValidationSchema = newValidationSchema.shape({
            ...newValidationSchema.fields,
            [`${inputName}_${i}`]: Yup.string().required("Campo requerido"),
            [`${inputName}number_${i}`]: Yup.string().required("Campo requerido"),
            [`${inputName}start_date_${i}`]: Yup.string().required("Campo requerido"),
            [`${inputName}end_date_${i}`]: Yup.string().required("Campo requerido"),
        });
        setNewValidationSchema(updatedValidationSchema);
    };

    const FormikTextField = ({ label, type, options, multiline, rows, ...props }) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : "";
        if (props.name === "civil_responsibility_policy" || props.name === "compliance_policy" || props.name === "insurance_policy") {
            return (
                <>
                    <Divider sx={{ width: "100%", mt: "2rem" }}>
                        <Chip label={label} size="small" />
                    </Divider>
                    <TextField key={props.name} sx={{ width: "390px" }} type={type} label={label} {...field} helperText={errorText} error={!!errorText} />
                </>
            );
        }
        if (label === "Renovación del contrato") {
            return (
                <>
                    <TextField
                        key={props.name}
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
                </>
            );
        } else if (type === "date") {
            return (
                <TextField
                    key={props.name}
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
        } else {
            return (
                <TextField
                    key={props.name}
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
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Clientes", width: 750, editable: false },
        { field: "duration", headerName: "Duración", width: 100, editable: false },
        { field: "start_date", headerName: "Fecha Inicio", width: 100, editable: false },
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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                    Contratos y Pólizas Legales
                </Typography>
                <DataGrid
                    sx={{ width: "100%", minHeight: "83vh", maxHeight: "83vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}
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
                    <Formik initialValues={newInitialValues} validationSchema={newValidationSchema} onSubmit={handleSubmit}>
                        <Form>
                            <Box sx={{ display: "flex", gap: "1rem", pt: "0.5rem", flexWrap: "wrap" }}>
                                {inputs.clients.map((input, index) => {
                                    return <FormikTextField key={index} type={input.type} name={input.name} label={input.label} autoComplete="off" spellCheck={false} />;
                                })}
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                                    {inputs.civilResponsibilityPolicy.map((input, index) => {
                                        const uniqueKey = `${input.name}_${index}`; // Generate a unique key using input name and index
                                        if (index === inputs.civilResponsibilityPolicy.length - 1) {
                                            return (
                                                <React.Fragment key={uniqueKey}>
                                                    <FormikTextField type={input.type} name={input.name} label={input.label} autoComplete="off" spellCheck={false} />

                                                    <Button
                                                        onClick={() => handleAddPolicies(input.name, (index + 5) / 4, "civilResponsibilityPolicy", input.label)}
                                                        startIcon={<AddIcon />}
                                                        variant="outlined"
                                                    >
                                                        Añadir
                                                    </Button>
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <FormikTextField key={index} type={input.type} name={input.name} label={input.label} autoComplete="off" spellCheck={false} />
                                        );
                                    })}
                                    {inputs.compliancePolicy.map((input, index) => {
                                        const uniqueKey = `${input.name}_${index}`; // Generate a unique key using input name and index
                                        if (index === inputs.compliancePolicy.length - 1) {
                                            return (
                                                <React.Fragment key={uniqueKey}>
                                                    <FormikTextField type={input.type} name={input.name} label={input.label} autoComplete="off" spellCheck={false} />

                                                    <Button
                                                        onClick={() => handleAddPolicies(input.name, (index + 5) / 4, "compliancePolicy", input.label)}
                                                        startIcon={<AddIcon />}
                                                        variant="outlined"
                                                    >
                                                        Añadir
                                                    </Button>
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <FormikTextField key={index} type={input.type} name={input.name} label={input.label} autoComplete="off" spellCheck={false} />
                                        );
                                    })}
                                    {inputs.insurancePolicy.map((input, index) => {
                                        const uniqueKey = `${input.name}_${index}`; // Generate a unique key using input name and index
                                        if (index === inputs.insurancePolicy.length - 1) {
                                            return (
                                                <React.Fragment key={uniqueKey}>
                                                    <FormikTextField type={input.type} name={input.name} label={input.label} autoComplete="off" spellCheck={false} />

                                                    <Button
                                                        onClick={() => handleAddPolicies(input.name, (index + 5) / 4, "insurancePolicy", input.label)}
                                                        startIcon={<AddIcon />}
                                                        variant="outlined"
                                                    >
                                                        Añadir
                                                    </Button>
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <FormikTextField key={index} type={input.type} name={input.name} label={input.label} autoComplete="off" spellCheck={false} />
                                        );
                                    })}
                                </Box>
                                {inputs.renovation.map((input, index) => {
                                    return (
                                        <Box key={index} sx={{ pt: "2rem" }}>
                                            <FormikTextField key={index} type={input.type} name={input.name} label={input.label} autoComplete="off" spellCheck={false} />
                                        </Box>
                                    );
                                })}

                                <Box sx={{ width: "100%", textAlign: "end" }}>
                                    <Button variant="contained" type="submit" startIcon={<SaveIcon></SaveIcon>}>
                                        Guardar
                                    </Button>
                                </Box>
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
                    <Formik initialValues={details} onSubmit={handleSubmitEdit}>
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

export default Legal;
