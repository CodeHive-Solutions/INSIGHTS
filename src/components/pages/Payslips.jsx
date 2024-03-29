import { useState, useEffect } from "react";

// Libraries
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

// Material-UI
import { Container, Box, Button, Typography, styled, LinearProgress, Fade, Tooltip, Dialog, DialogTitle, DialogContent } from "@mui/material";
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

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes("payslip.add_payslip")) {
            navigate("/logged/home");
        }
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

    const handleResend = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${getApiUrl()}payslips/${id}/resend/`, {
                method: "POST",
                credentials: "include",
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
                setLoading(false);
                getPayslips();
                showSnack("success", "Desprendible reenviado correctamente");
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            showSnack("error", error.message);
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
            field: "area",
            headerName: "Area",
            width: 250,
            editable: false,
        },
        {
            field: "biweekly_period",
            type: "number",
            headerName: "Quincena",
            width: 150,
            editable: false,
            valueGetter: (params) => params.row.biweekly_period * 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(params.value),
        },
        {
            field: "created_at",
            type: "date",
            headerName: "Fecha de envió",
            width: 150,
            editable: false,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
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
                            onClick={() => handleResend(GridRowParams.id)}
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
            "bonus_paycheck",
            "biannual_bonus",
            "severance",
            "gross_earnings",
            "healthcare_contribution",
            "pension_contribution",
            "tax_withholding",
            "apsalpen",
            "additional_deductions",
            "total_deductions",
            "net_pay",
        ];

        for (let i = 1; i < lines.length; i++) {
            const obj = { id: i }; // Add an id field
            const row = lines[i].split(",");

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
            console.log(csvToJSON(data));
            setPreviewRows(csvToJSON(data));
        };

        reader.readAsBinaryString(file);
    };

    const submitPayslipFile = async () => {
        setLoadingPreview(true);

        try {
            const formData = new FormData();
            formData.append("file", payslipFile);
            const response = await fetch(`${getApiUrl()}payslips/`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error("Lo sentimos, se ha producido un error inesperado.");
                } else if (response.status === 400) {
                    if (data.Error === "No se encontró el usuario, asegúrate de que esta registrado en la intranet") {
                        throw new Error(data.Error + ". Cedula: " + data.cedula);
                    }
                    throw new Error(data.Error);
                }
                throw new Error(data.detail);
            } else if (response.status === 201) {
                handleCloseDialog();
                setLoadingPreview(false);
                getPayslips();
                showSnack("success", "Desprendibles cargados y enviados correctamente");
            }
        } catch (error) {
            setLoadingPreview(false);
            console.error(error);
            showSnack("error", error.message);
        }
    };

    return (
        <>
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
                    Registro de desprendibles de nomina
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

export default Payslips;
