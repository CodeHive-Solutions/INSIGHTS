import { useState, useEffect, useRef } from "react";

// Libraries
import { useNavigate } from "react-router-dom";

// Material-UI
import { Container, Box, Button, Typography, styled, LinearProgress, Fade, Tooltip, Dialog, DialogTitle, DialogContent, TextField, Chip, Collapse } from "@mui/material";
import {
    DataGrid,
    gridClasses,
    GridActionsCellItem,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarContainer,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import { handleError } from "../../assets/handleError";
import VacationsRequest from "../shared/VacationsRequest.jsx";
import { CustomNoResultsOverlay } from "../../assets/CustomNoResultsOverlay";

// Icons
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export const Vacations = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const [openVacation, setOpenVacation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDialogPayslip, setOpenDialogPayslip] = useState(false);
    const [vacationId, setVacationId] = useState();
    const [disabled, setDisabled] = useState(false);
    const [openObservationsInput, setOpenObservationsInput] = useState(false);
    const observationsRef = useRef();
    const cargo = localStorage.getItem("cargo");
    const rank = JSON.parse(localStorage.getItem("rango"));
    const cedula = JSON.parse(localStorage.getItem("cedula"));
    const managerApprovalPermission = cargo.includes("GERENTE") || cedula === "1022370826";
    const hrApprovalPermission = cargo === `"GERENTE DE GESTION HUMANA"`;
    const payrollApprovalPermission = permissions.includes("vacation.payroll_approbation");
    const [buttonType, setButtonType] = useState("button");
    const [approvalType, setApprovalType] = useState("");

    const getVacations = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}vacation/`, {
                method: "GET",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setRows(data);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getVacations();
    }, []);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const handleApproval = async (event) => {
        event.preventDefault();
        setDisabled(true);
        setLoading(true);

        const formData = new FormData();

        if (buttonType === "submit") {
            formData.append(approvalType, 0);
            formData.append("comment", observationsRef.current.value);
        } else {
            formData.append(approvalType, 1);
        }

        try {
            const response = await fetch(`${getApiUrl().apiUrl}vacation/${vacationId}/`, {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                setLoading(false);
                setDisabled(false);
                getVacations();
                showSnack("success", "Solicitud de vacaciones actualizada");
                handleCloseDialogPayslip();
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
            setLoading(false);
            setDisabled(false);
        }
    };

    const columns = [
        {
            field: "start_date",
            headerName: "Fecha inicio",
            width: 110,
            type: "date",
            valueGetter: (value) => {
                if (value) {
                    const date = new Date(value + "T00:00:00");
                    return date;
                } else {
                    return "";
                }
            },
        },
        {
            field: "end_date",
            headerName: "Fecha fin",
            type: "date",
            width: 110,
            valueGetter: (value) => {
                if (value) {
                    const date = new Date(value + "T00:00:00");
                    return date;
                } else {
                    return "";
                }
            },
        },
        {
            field: "created_at",
            headerName: "Fecha de solicitud",
            width: 150,
            type: "date",
            valueGetter: (value) => {
                if (value) {
                    let dateWithoutTime = value.split("T")[0];
                    const date = new Date(dateWithoutTime + "T00:00:00");
                    return date;
                } else {
                    return "";
                }
            },
        },
        {
            field: "uploaded_by",
            headerName: "Solicitado por",
            width: 250,
        },
        {
            field: "user",
            headerName: "Solicitado para",
            width: 250,
        },
        {
            field: "manager_approbation",
            headerName: "Aprobación gerente",
            width: 160,
            type: "singleSelect",
            valueOptions: ["PENDIENTE", "APROBADA", "RECHAZADA"],
            // return a chip with the status
            valueGetter: (value) => {
                if (value === null) {
                    return "PENDIENTE";
                } else if (value === true) {
                    return "APROBADA";
                }
                return "RECHAZADA";
            },
            renderCell: (params) => {
                if (params.value === "PENDIENTE") {
                    return (
                        <Chip
                            onClick={managerApprovalPermission ? () => handleVacancyApproval(params.id, "manager_approbation") : undefined}
                            icon={<PendingIcon />}
                            label="Pendiente"
                        />
                    );
                } else if (params.value === "APROBADA") {
                    return (
                        <Chip
                            onClick={managerApprovalPermission ? () => handleVacancyApproval(params.id, "manager_approbation") : undefined}
                            icon={<CheckCircleIcon />}
                            label="Aprobada"
                            color="success"
                        />
                    );
                }
                return (
                    <Chip
                        onClick={managerApprovalPermission ? () => handleVacancyApproval(params.id, "manager_approbation") : undefined}
                        icon={<CancelIcon />}
                        label="Rechazado"
                        color="error"
                    />
                );
            },
        },
        {
            field: "hr_approbation",
            headerName: "Aprobación RH",
            width: 150,
            type: "singleSelect",
            valueOptions: ["PENDIENTE", "APROBADA", "RECHAZADA"],
            // return a chip with the status
            valueGetter: (value) => {
                if (value === null) {
                    return "PENDIENTE";
                } else if (value === true) {
                    return "APROBADA";
                }
                return "RECHAZADA";
            },
            renderCell: (params) => {
                if (params.value === "PENDIENTE") {
                    return (
                        <Chip
                            onClick={
                                params.row.manager_approbation === true && hrApprovalPermission ? () => handleVacancyApproval(params.id, "hr_approbation") : undefined
                            }
                            icon={<PendingIcon />}
                            label="Pendiente"
                        />
                    );
                } else if (params.value === "APROBADA") {
                    return (
                        <Chip
                            onClick={hrApprovalPermission ? () => handleVacancyApproval(params.id, "hr_approbation") : undefined}
                            icon={<CheckCircleIcon />}
                            label="Aprobada"
                            color="success"
                        />
                    );
                }
                return (
                    <Chip
                        onClick={params.row.manager_approbation === true && hrApprovalPermission ? () => handleVacancyApproval(params.id, "hr_approbation") : undefined}
                        icon={<CancelIcon />}
                        label="Rechazada"
                        color="error"
                    />
                );
            },
        },
        {
            field: "payroll_approbation",
            headerName: "Aprobación nomina",
            width: 160,
            type: "singleSelect",
            valueOptions: ["PENDIENTE", "APROBADA", "RECHAZADA"],
            // return a chip with the status
            valueGetter: (value) => {
                if (value === null) {
                    return "PENDIENTE";
                } else if (value === true) {
                    return "APROBADA";
                }
                return "RECHAZADA";
            },
            renderCell: (params) => {
                if (params.value === "PENDIENTE") {
                    return (
                        <Chip
                            onClick={
                                params.row.hr_approbation === true && payrollApprovalPermission
                                    ? () => handleVacancyApproval(params.id, "payroll_approbation")
                                    : undefined
                            }
                            icon={<PendingIcon />}
                            label="Pendiente"
                        />
                    );
                } else if (params.value === "APROBADA") {
                    return (
                        <Chip
                            onClick={
                                params.row.hr_approbation === true && payrollApprovalPermission
                                    ? () => handleVacancyApproval(params.id, "payroll_approbation")
                                    : undefined
                            }
                            icon={<CheckCircleIcon />}
                            label="Aprobada"
                            color="success"
                        />
                    );
                }
                return (
                    <Chip
                        onClick={
                            params.row.hr_approbation === true && payrollApprovalPermission ? () => handleVacancyApproval(params.id, "payroll_approbation") : undefined
                        }
                        icon={<CancelIcon />}
                        label="Rechazada"
                        color="error"
                    />
                );
            },
        },

        {
            field: "comment",
            headerName: "Observaciones",
            width: 150,
        },
        {
            field: "status",
            headerName: "Estado de solicitud",
            width: 150,
            type: "singleSelect",
            valueOptions: ["PENDIENTE", "APROBADA", "RECHAZADA", "CANCELADA"],
            // return a chip with the status
            renderCell: (params) => {
                if (params.value === "PENDIENTE") {
                    return <Chip icon={<PendingIcon />} label="Pendiente" />;
                } else if (params.value === "APROBADA") {
                    return <Chip icon={<CheckCircleIcon />} label="Aprobada" color="success" />;
                } else if (params.value === "RECHAZADA") {
                    return <Chip icon={<CancelIcon />} label="Rechazada" color="error" />;
                }
                return <Chip icon={<EventBusyIcon />} label="Cancelado" color="warning" />;
            },
        },
        {
            field: "letter",
            headerName: "Carta de solicitud",
            width: 150,
            type: "actions",
            cellClassName: "actions",
            getActions: ({ row }) => {
                return [
                    <Tooltip title="Ver carta de solicitud de vacaciones" arrow>
                        <GridActionsCellItem
                            icon={<FileOpenIcon />}
                            label="open-letter"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={() => {
                                const requestFile = row.request_file.replace(/^\//, "");
                                window.open(`${getApiUrl().apiUrl}${requestFile}`, "_blank");
                            }}
                        />
                    </Tooltip>,
                ];
            },
        },
    ];

    const handleOpenDialog = () => setOpenVacation(true);

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: "registro-desprendibles",
                        delimiter: ";",
                        utf8WithBom: true,
                    }}
                />
                {rank > 1 ? (
                    <Button size="small" onClick={handleOpenDialog} startIcon={<BeachAccessIcon />}>
                        Crear solicitud
                    </Button>
                ) : null}
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    const handleCloseDialogPayslip = () => {
        setOpenDialogPayslip(false);
        setDisabled(false);
        setOpenObservationsInput(false);
        setButtonType("button");
        setLoading(false);
    };

    const handleDecline = async () => {
        setOpenObservationsInput(true);
        setButtonType("submit");
    };

    const handleVacancyApproval = (id, approvalType) => {
        setOpenDialogPayslip(true);
        setVacationId(id);
        setApprovalType(approvalType);
    };

    return (
        <>
            <VacationsRequest getVacations={getVacations} openVacation={openVacation} setOpenVacation={setOpenVacation} />
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
            <Dialog open={openDialogPayslip} onClose={handleCloseDialogPayslip} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿ Aprobar solicitud de vacaciones?"}</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Si aprueba la solicitud de vacaciones, el empleado será notificado y se continuara con el proceso de aprobación de la solicitud.
                    </Typography>
                    <Box component="form" onSubmit={handleApproval}>
                        <Collapse in={openObservationsInput}>
                            <TextField
                                inputRef={observationsRef}
                                sx={{ my: "1rem" }}
                                required={buttonType === "submit"}
                                disabled={disabled}
                                variant="filled"
                                fullWidth
                                id="outlined-multiline-flexible"
                                label="Observaciones"
                                multiline
                                maxRows={4}
                            />
                        </Collapse>

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "1rem" }}>
                            <Button disabled={disabled} variant="contained" onClick={handleCloseDialogPayslip} color="primary">
                                Cancelar
                            </Button>
                            <Box sx={{ display: "flex", gap: "1rem" }}>
                                <Collapse in={buttonType === "button"}>
                                    <Button onClick={handleDecline} type={buttonType} disabled={disabled} variant="contained" color="error">
                                        Rechazar
                                    </Button>
                                </Collapse>
                                <Button type="submit" disabled={disabled} variant="contained" color={buttonType === "submit" ? "error" : "primary"}>
                                    {buttonType === "submit" ? "Rechazar" : "Aprobar"}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
            <Fade in={loading} unmountOnExit>
                <LinearProgress variant="query" sx={{ width: "100%", position: "absolute", top: 0, zIndex: "100000" }} />
            </Fade>
            <Container
                sx={{
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                    Registro de vacaciones
                </Typography>
                <Box sx={{ height: "80vh" }}>
                    <DataGrid
                        loading={rows.length === 0}
                        getRowHeight={() => "auto"}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "created_at", sort: "desc" }],
                            },
                        }}
                        slots={{
                            toolbar: CustomToolbar,
                            noResultsOverlay: CustomNoResultsOverlay,
                        }}
                        slotProps={{
                            loadingOverlay: {
                                variant: "skeleton",
                                noRowsVariant: "skeleton",
                            },
                        }}
                        sx={{
                            boxShadow: "0px 0px 5px 0px #e0e0e0",
                            borderRadius: "10px",
                            [`& .${gridClasses.cell}`]: {
                                py: 1,
                            },
                        }}
                        columns={columns}
                        rows={rows}
                    ></DataGrid>
                </Box>
            </Container>
        </>
    );
};

export default Vacations;
