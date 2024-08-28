import { useState, useEffect, useRef } from "react";

// Material-UI
import { Tooltip, Container, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, Collapse, Box, LinearProgress, Fade, Alert, styled } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { handleError } from "../../assets/handleError";

// Icons
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import { CustomNoResultsOverlay } from "../../assets/CustomNoResultsOverlay";

export const MyPayslips = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCollapse, setOpenCollapse] = useState(false);
    const [paySlipId, setPaySlipId] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentEmail = JSON.parse(localStorage.getItem("email"));
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const cedula = JSON.parse(localStorage.getItem("cedula"));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getPayslips = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}payslips/`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                const data = await response.json();
                if (permissions && permissions.includes("payslip.view_payslip")) {
                    const userPayslips = data.filter((payslip) => payslip.identification === cedula);
                    setRows(userPayslips);
                } else {
                    setRows(data);
                }
            }

            await handleError(response, showSnack);
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getPayslips();
    }, []);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCollapse = () => {
        setOpenCollapse(!openCollapse);
    };

    const handleOpenDialog = (id) => {
        setPaySlipId(id);
        setOpenDialog(true);
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenCollapse(false);
        setPaySlipId(null);
    };

    const handleResend = async () => {
        setDisabled(true);
        setLoading(true);

        try {
            const response = await fetch(`${getApiUrl().apiUrl}payslips/${paySlipId}/resend/`, {
                method: "POST",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 201) {
                showSnack("success", "Desprendible reenviado correctamente");
                setPaySlipId(null);
                setDisabled(false);
                setOpenDialog(false);
                setOpenCollapse(false);
                setLoading(false);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
            setDisabled(false);
            setLoading(false);
        }
    };

    const columns = [
        { field: "title", headerName: "Desprendible", width: 400, editable: false },
        {
            field: "created_at",
            type: "date",
            headerName: "Fecha de Envió",
            width: 150,
            editable: false,
            valueGetter: (value) => {
                return new Date(value);
            },
        },
        {
            field: "gross_earnings",
            type: "number",
            headerName: "Total Devengado",
            width: 150,
            editable: false,
            valueFormatter: (value) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(value),
        },
        {
            field: "total_deductions",
            type: "number",
            headerName: "Total Deducciones",
            width: 150,
            editable: false,
            valueFormatter: (value) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(value),
        },
        {
            field: "net_pay",
            type: "number",
            headerName: "Pago Neto",
            width: 150,
            editable: false,
            valueFormatter: (value) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(value),
        },
        {
            field: "reenviar",
            headerName: "Reenviar",
            width: 100,
            type: "actions",
            cellClassName: "actions",
            getActions: (GridRowParams) => {
                return [
                    <Tooltip title="Reenviar" arrow>
                        <GridActionsCellItem
                            icon={<ForwardToInboxIcon />}
                            label="resend"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={() => handleOpenDialog(GridRowParams.row.id)}
                        />
                    </Tooltip>,
                ];
            },
        },
    ];

    return (
        <>
            <Fade in={loading} unmountOnExit>
                <LinearProgress variant="query" sx={{ width: "100%", position: "absolute", top: 0, zIndex: "100000" }} />
            </Fade>
            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿Reenviar desprendible de nomina?"}</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        El desprendible de nomina sera reenviado al correo electrónico:{" "}
                        <span style={{ fontWeight: 500, color: "rgb(0,0,0,0.8)" }}>{currentEmail?.toLowerCase()}</span>
                    </Typography>
                    <Collapse in={openCollapse}>
                        <Alert severity="info" sx={{ mt: "1rem" }}>
                            Si este no es tu correo electrónico, por favor, ingresa al modulo de mi cuenta y actualiza tu correo electrónico. Recuerda cerrar sesión y
                            volver a iniciar sesión para que los cambios surtan efecto.
                        </Alert>
                    </Collapse>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: "1rem" }}>
                        <Box>
                            <Collapse in={!openCollapse}>
                                <Button sx={{ mt: "1rem" }} onClick={handleCollapse}>
                                    Ese no es mi correo
                                </Button>
                            </Collapse>
                        </Box>
                        <Box>
                            <Button disabled={disabled} variant="contained" sx={{ mt: "1rem", mx: "1rem" }} onClick={handleCloseDialog} color="primary">
                                Cancelar
                            </Button>
                            <Button disabled={disabled} variant="contained" sx={{ mt: "1rem" }} onClick={handleResend} color="primary">
                                Enviar
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />

            <Container
                sx={{
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                    Mis desprendibles de nomina
                </Typography>
                <Box sx={{ height: "80vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}>
                    <DataGrid
                        loading={rows.length === 0}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "created_at", sort: "desc" }],
                            },
                        }}
                        slots={{ toolbar: GridToolbar, noResultsOverlay: CustomNoResultsOverlay }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                            loadingOverlay: {
                                variant: "skeleton",
                                noRowsVariant: "skeleton",
                            },
                        }}
                        columns={columns}
                        toolbar
                        rows={rows}
                    ></DataGrid>
                </Box>
            </Container>
        </>
    );
};

export default MyPayslips;
