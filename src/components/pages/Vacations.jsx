import { useState, useEffect, useRef } from "react";

// Libraries
import { useNavigate } from "react-router-dom";

// Material-UI
import { Container, Box, Button, Typography, styled, LinearProgress, Fade, Tooltip, Dialog, DialogTitle, DialogContent, TextField, Chip, Collapse } from "@mui/material";
import {
    DataGrid,
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

// Icons
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";

const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .no-results-primary": {
        fill: theme.palette.mode === "light" ? "#AEB8C2" : "#3D4751",
    },
    "& .no-results-secondary": {
        fill: theme.palette.mode === "light" ? "#E8EAED" : "#1D2126",
    },
    "& .no-rows-primary": {
        fill: theme.palette.mode === "light" ? "#AEB8C2" : "#3D4751",
    },
    "& .no-rows-secondary": {
        fill: theme.palette.mode === "light" ? "#E8EAED" : "#1D2126",
    },
}));

function CustomNoResultsOverlay() {
    return (
        <StyledGridOverlay>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={96} viewBox="0 0 523 299" aria-hidden focusable="false">
                <path
                    className="no-results-primary"
                    d="M262 20c-63.513 0-115 51.487-115 115s51.487 115 115 115 115-51.487 115-115S325.513 20 262 20ZM127 135C127 60.442 187.442 0 262 0c74.558 0 135 60.442 135 135 0 74.558-60.442 135-135 135-74.558 0-135-60.442-135-135Z"
                />
                <path
                    className="no-results-primary"
                    d="M348.929 224.929c3.905-3.905 10.237-3.905 14.142 0l56.569 56.568c3.905 3.906 3.905 10.237 0 14.143-3.906 3.905-10.237 3.905-14.143 0l-56.568-56.569c-3.905-3.905-3.905-10.237 0-14.142ZM212.929 85.929c3.905-3.905 10.237-3.905 14.142 0l84.853 84.853c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-84.853-84.853c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-results-primary"
                    d="M212.929 185.071c-3.905-3.905-3.905-10.237 0-14.142l84.853-84.853c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-84.853 84.853c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-results-secondary"
                    d="M0 43c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 53 0 48.523 0 43ZM0 89c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 99 0 94.523 0 89ZM0 135c0-5.523 4.477-10 10-10h74c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 181c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 227c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM523 227c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10ZM523 181c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 135c0 5.523-4.477 10-10 10h-74c-5.523 0-10-4.477-10-10s4.477-10 10-10h74c5.523 0 10 4.477 10 10ZM523 89c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 43c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10Z"
                />
            </svg>
            <Box sx={{ mt: 2, color: "gray" }}>No hay resultados</Box>
        </StyledGridOverlay>
    );
}

const CustomNoRowsOverlay = () => {
    return (
        <StyledGridOverlay>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={96} viewBox="0 0 452 257" aria-hidden focusable="false">
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box sx={{ mt: 2, color: "gray" }}>Sin resultados</Box>
        </StyledGridOverlay>
    );
};

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
            const response = await fetch(`${getApiUrl().apiUrl}vacation/request`, {
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
            const response = await fetch(`${getApiUrl().apiUrl}vacation/request/${vacationId}/`, {
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
        { field: "id", headerName: "ID", width: 50, editable: false },
        {
            field: "start_date",
            headerName: "Fecha inicio",
            width: 110,
            type: "date",
            valueGetter: (params) => {
                if (params.value) {
                    const date = new Date(params.value + "T00:00:00");
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
            valueGetter: (params) => {
                if (params.value) {
                    const date = new Date(params.value + "T00:00:00");
                    return date;
                } else {
                    return "";
                }
            },
        },
        {
            field: "uploaded_at",
            headerName: "Fecha de solicitud",
            width: 150,
            type: "date",
            valueGetter: (params) => {
                if (params.value) {
                    let dateWithoutTime = params.value.split("T")[0];
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
            valueGetter: (params) => {
                if (params.value === null) {
                    return "PENDIENTE";
                } else if (params.value === true) {
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
            valueGetter: (params) => {
                if (params.value === null) {
                    return "PENDIENTE";
                } else if (params.value === true) {
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
            valueGetter: (params) => {
                if (params.value === null) {
                    return "PENDIENTE";
                } else if (params.value === true) {
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
            getActions: (GridRowParams) => {
                return [
                    <Tooltip title="Ver carta de solicitud de vacaciones" arrow>
                        <GridActionsCellItem
                            icon={<FileOpenIcon />}
                            label="open-letter"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={() => window.open(`${getApiUrl().apiUrl}${GridRowParams.row.request_file}`, "_blank")}
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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                    Registro de vacaciones
                </Typography>
                <Box sx={{ width: "100%", height: "80vh" }}>
                    <DataGrid
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "id", sort: "desc" }],
                            },
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                },
                            },
                        }}
                        slots={{
                            toolbar: CustomToolbar,
                            noRowsOverlay: CustomNoRowsOverlay,
                            noResultsOverlay: CustomNoResultsOverlay,
                        }}
                        sx={{ boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}
                        columns={columns}
                        rows={rows}
                    ></DataGrid>
                </Box>
            </Container>
        </>
    );
};

export default Vacations;
