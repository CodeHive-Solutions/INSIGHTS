import { useState, useEffect, useRef } from "react";

// Material-UI
import { Tooltip, Container, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, Collapse, Box, LinearProgress, Fade } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";

// Icons
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";

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
    const emailRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getPayslips = async () => {
        try {
            const response = await fetch(`${getApiUrl()}payslips/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail);
            } else if (response.status === 200) {
                setRows(data);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    useEffect(() => {
        getPayslips();
    }, []);

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const handleCollapse = () => {
        setOpenCollapse(!openCollapse);
        emailRef.current.value = "";
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
        const formData = new FormData();

        if (emailRef.current && emailRef.current.value) {
            formData.append("email", emailRef.current.value);
        }

        try {
            const response = await fetch(`${getApiUrl()}payslips/${paySlipId}/resend/`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error("Lo sentimos, se ha producido un error inesperado.");
                } else if (response.status === 400) {
                    throw new Error(data.Error);
                }
                throw new Error(data.detail);
            } else if (response.status === 201) {
                showSnack("success", "Desprendible reenviado correctamente");
                setPaySlipId(null);
                setDisabled(false);
                setOpenDialog(false);
                setOpenCollapse(false);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
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
            valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: "gross_earnings",
            type: "number",
            headerName: "Total Devengado",
            width: 150,
            editable: false,
            valueGetter: (params) => params.row.gross_earnings * 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(params.value),
        },
        {
            field: "total_deductions",
            type: "number",
            headerName: "Total Deducciones",
            width: 150,
            editable: false,
            valueGetter: (params) => params.row.total_deductions * 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(params.value),
        },
        {
            field: "net_pay",
            type: "number",
            headerName: "Pago Neto",
            width: 150,
            editable: false,
            valueGetter: (params) => params.row.net_pay * 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(params.value),
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
                        <span style={{ fontWeight: 500, color: "rgb(0,0,0,0.8)" }}>{currentEmail.toLowerCase()}</span>
                    </Typography>
                    <Collapse in={openCollapse}>
                        <TextField
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
                    </Collapse>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: "1rem" }}>
                        <Box>
                            <Collapse in={!openCollapse}>
                                <Button variant="outlined" sx={{ mt: "1rem" }} onClick={handleCollapse}>
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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                    Mis desprendibles de nomina
                </Typography>
                <DataGrid
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "created_at", sort: "desc" }],
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    sx={{ width: "100%", minHeight: "83vh", maxHeight: "83vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}
                    columns={columns}
                    toolbar
                    rows={rows}
                ></DataGrid>
            </Container>
        </>
    );
};

export default MyPayslips;
