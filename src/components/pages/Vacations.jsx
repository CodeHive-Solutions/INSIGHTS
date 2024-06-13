import { useState, useEffect, useRef } from "react";

// Libraries
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

// Material-UI
import { Container, Box, Button, Typography, styled, LinearProgress, Fade, Tooltip, Dialog, DialogTitle, DialogContent, TextField, Chip } from "@mui/material";
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
import PayslipsPreview from "./PayslipsPreview.jsx";
import { getApiUrl } from "../../assets/getApi";
import { handleError } from "../../assets/handleError";

// Icons
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import BlockIcon from "@mui/icons-material/Block";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export const Vacations = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const [openDialog, setOpenDialog] = useState(false);
    const [fileName, setFileName] = useState("Subir archivo");
    const [payslipFile, setPayslipFile] = useState(null);
    const [previewRows, setPreviewRows] = useState([]);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDialogPayslip, setOpenDialogPayslip] = useState(false);
    const [openCollapseEmail, setOpenCollapseEmail] = useState(false);
    const [idPayslip, setIdPayslip] = useState();
    const [disabled, setDisabled] = useState(false);
    const emailRef = useRef();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes("vacation.view_vacationrequest")) {
            navigate("/logged/home");
        }
    }, []);

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

    const handleResend = async (event) => {
        event.preventDefault();
        setDisabled(true);
        setLoading(true);
        const formData = new FormData();
        formData.append("email", emailRef.current.value);

        try {
            const response = await fetch(`${getApiUrl().apiUrl}payslips/${idPayslip}/resend/`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            await handleError(response, showSnack);

            if (response.status === 201) {
                setLoading(false);
                setDisabled(false);
                getPayslips();
                showSnack("success", "Desprendible reenviado correctamente");
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
            valueOptions: ["PENDIENTE", "APROBADO", "RECHAZADA"],
            // return a chip with the status
            valueGetter: (params) => {
                if (params.value === null) {
                    return "PENDIENTE";
                } else if (params.value === true) {
                    return "APROBADO";
                }
                return "RECHAZADA";
            },
            renderCell: (params) => {
                if (params.value === "PENDIENTE") {
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<PendingIcon />} label="Pendiente" />;
                } else if (params.value === "APROBADO") {
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<CheckCircleIcon />} label="Aprobado" color="success" />;
                }
                return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<CancelIcon />} label="Rechazado" color="error" />;
            },
        },
        {
            field: "hr_approbation",
            headerName: "Aprobación RH",
            width: 150,
            type: "singleSelect",
            valueOptions: ["PENDIENTE", "APROBADO", "RECHAZADA"],
            // return a chip with the status
            valueGetter: (params) => {
                if (params.value === null) {
                    return "PENDIENTE";
                } else if (params.value === true) {
                    return "APROBADO";
                }
                return "RECHAZADA";
            },
            renderCell: (params) => {
                if (params.value === "PENDIENTE") {
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<PendingIcon />} label="Pendiente" />;
                } else if (params.value === "APROBADO") {
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<CheckCircleIcon />} label="Aprobada" color="success" />;
                }
                return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<CancelIcon />} label="Rechazada" color="error" />;
            },
        },
        {
            field: "payroll_approbation",
            headerName: "Aprobación nomina",
            width: 160,
            type: "singleSelect",
            valueOptions: ["PENDIENTE", "APROBADO", "RECHAZADA"],
            // return a chip with the status
            valueGetter: (params) => {
                if (params.value === null) {
                    return "PENDIENTE";
                } else if (params.value === true) {
                    return "APROBADO";
                }
                return "RECHAZADA";
            },
            renderCell: (params) => {
                if (params.value === "PENDIENTE") {
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<PendingIcon />} label="Pendiente" />;
                } else if (params.value === "APROBADO") {
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<CheckCircleIcon />} label="Aprobado" color="success" />;
                }
                return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<CancelIcon />} label="Rechazada" color="error" />;
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
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<PendingIcon />} label="Pendiente" />;
                } else if (params.value === "APROBADA") {
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<CheckCircleIcon />} label="Aprobada" color="success" />;
                } else if (params.value === "RECHAZADA") {
                    return <Chip onClick={() => handleVacancyApproval(params.id)} icon={<CancelIcon />} label="Rechazada" color="error" />;
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
                            onClick={() => handleOpenDialogPayslip(GridRowParams.id)}
                        />
                    </Tooltip>,
                ];
            },
        },
    ];

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFileName("Subir archivo");
        setPayslipFile(null);
        setPreviewRows([]);
    };

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
                <Button size="small" onClick={handleOpenDialog} startIcon={<PersonAddAlt1Icon />}>
                    AÑADIR
                </Button>
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    const handleFileInputChange = (event) => {
        setFileName(event.target.files[0].name);
        setPayslipFile(event.target.files[0]);
    };

    const submitPayslipFile = async () => {
        setLoadingPreview(true);

        try {
            const formData = new FormData();
            formData.append("file", payslipFile);
            const response = await fetch(`${getApiUrl().apiUrl}payslips/`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            await handleError(response, showSnack);

            if (response.status === 201) {
                handleCloseDialog();
                setLoadingPreview(false);
                getPayslips();
                showSnack("success", "Desprendibles cargados y enviados correctamente");
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
            setLoadingPreview(false);
        }
    };

    const handleCollapseEmail = () => {
        setOpenCollapseEmail(!openCollapseEmail);
    };

    const handleCloseDialogPayslip = () => {
        setOpenDialogPayslip(false);
        setDisabled(false);
    };

    const handleOpenDialogPayslip = (id) => {
        setIdPayslip(id);
    };

    const handleVacancyApproval = (id) => {
        setOpenDialogPayslip(true);
    };

    return (
        <>
            <Dialog open={openDialogPayslip} onClose={handleCloseDialogPayslip} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿ Aprobar solicitud de vacaciones?"}</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Si aprueba la solicitud de vacaciones, el empleado será notificado y se continuara con el proceso de aprobación de la solicitud.
                    </Typography>
                    <Box component="form" onSubmit={handleResend}>
                        <TextField
                            required
                            sx={{ mt: "1rem" }}
                            inputRef={emailRef}
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Correo electrónico"
                            type="email"
                            fullWidth
                            variant="standard"
                        />

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "1rem" }}>
                            <Button disabled={disabled} variant="contained" onClick={handleCloseDialogPayslip} color="primary">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={disabled} variant="contained" color="primary">
                                Aprobar
                            </Button>
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
                <DataGrid
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "created_at", sort: "desc" }],
                        },
                    }}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    sx={{ width: "100%", minHeight: "83vh", maxHeight: "83vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}
                    columns={columns}
                    toolbar
                    rows={rows}
                ></DataGrid>
            </Container>
            <Dialog fullWidth={true} maxWidth="xl" open={openDialog} onClose={handleCloseDialog}>
                <Fade
                    in={loadingPreview}
                    style={{
                        transitionDelay: loadingPreview ? "800ms" : "0ms",
                    }}
                    unmountOnExit
                >
                    <LinearProgress />
                </Fade>
                <DialogTitle>Cargar Desprendibles de Nomina</DialogTitle>
                <DialogContent>
                    <Button sx={{ width: "250px", overflow: "hidden", mb: "2rem" }} variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                        {fileName}
                        <VisuallyHiddenInput id="file" name="file" type="file" accept=".csv" onChange={handleFileInputChange} />
                    </Button>
                    <PayslipsPreview rows={previewRows} />
                    <Button sx={{ mt: "1rem" }} variant="contained" onClick={submitPayslipFile} type="submit" startIcon={<ArrowCircleUpIcon></ArrowCircleUpIcon>}>
                        Subir
                    </Button>
                </DialogContent>
            </Dialog>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Vacations;
