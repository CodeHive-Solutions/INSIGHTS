import { useState, useEffect, useRef } from "react";

// Libraries
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

// Material-UI
import { Container, Box, Button, Typography, styled, LinearProgress, Fade, Tooltip, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
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
import { CustomNoResultsOverlay } from "../../assets/CustomNoResultsOverlay";

// Icons
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

export const Payslips = () => {
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
        if (!permissions || !permissions.includes("payslip.view_payslip")) {
            navigate("/logged/home");
        }
    }, []);

    const getPayslips = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}payslips/`, {
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
        getPayslips();
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
            field: "identification",
            headerName: "Cedula",
            width: 110,
            editable: false,
        },
        { field: "name", headerName: "Nombre", width: 300, editable: false },
        {
            field: "title",
            headerName: "Desprendible",
            width: 300,
            editable: false,
        },
        {
            field: "area",
            headerName: "Area",
            width: 150,
            editable: false,
        },
        {
            field: "biweekly_period",
            type: "number",
            headerName: "Quincena",
            width: 150,
            editable: false,
            valueFormatter: (value) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(value),
        },
        {
            field: "created_at",
            type: "date",
            headerName: "Fecha de envió",
            width: 100,
            editable: false,
            valueFormatter: (value) => new Date(value).toLocaleDateString(),
        },
        {
            field: "resend",
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

    function csvToJSON(csv) {
        const lines = csv.split("\n");
        const result = [];
        const headers = [
            "title",
            "identification",
            "name",
            "area",
            "job_title",
            "salary",
            "days",
            "biweekly_period",
            "transport_allowance",
            "surcharge_night_shift_hours",
            "surcharge_night_shift_allowance",
            "surcharge_night_shift_holiday_hours",
            "surcharge_night_shift_holiday_allowance",
            "surcharge_holiday_hours",
            "surcharge_holiday_allowance",
            "bonus_paycheck",
            "biannual_bonus",
            "severance",
            "gross_earnings",
            "healthcare_contribution",
            "pension_contribution",
            "tax_withholding",
            "additional_deductions",
            "apsalpen",
            "solidarity_fund_percentage",
            "solidarity_fund",
            "total_deductions",
            "net_pay",
        ];

        const parseCSVRow = (row) => {
            const result = [];
            let inQuotes = false;
            let value = "";

            for (let char of row) {
                if (char === '"' && inQuotes) {
                    inQuotes = false;
                } else if (char === '"' && !inQuotes) {
                    inQuotes = true;
                } else if (char === "," && !inQuotes) {
                    result.push(value);
                    value = "";
                } else {
                    value += char;
                }
            }

            result.push(value);
            return result;
        };

        for (let i = 1; i < lines.length; i++) {
            const obj = { id: i }; // Add an id field
            const row = parseCSVRow(lines[i]);

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = row[j];
            }

            result.push(obj);
        }

        return result;
    }

    const handleFileInputChange = (event) => {
        setFileName(event.target.files[0].name);
        setPayslipFile(event.target.files[0]);

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_csv(worksheet, { header: 1 });
            setPreviewRows(csvToJSON(data));
        };

        reader.readAsBinaryString(file);
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
        setOpenDialogPayslip(true);
    };

    return (
        <>
            <Dialog open={openDialogPayslip} onClose={handleCloseDialogPayslip} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿Reenviar desprendible de nomina?"}</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Digita la dirección de correo electrónico al cual deseas que sea reenviado el desprendible de nomina correspondiente.
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
                                Enviar
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
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                    Registro de desprendibles de nomina
                </Typography>

                <Box sx={{ height: "80vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}>
                    <DataGrid
                        loading={rows.length === 0}
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
                        columns={columns}
                        toolbar
                        rows={rows}
                    ></DataGrid>
                </Box>
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

export default Payslips;
