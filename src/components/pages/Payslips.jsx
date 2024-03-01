import React, { useState, useCallback, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SnackbarAlert from "../common/SnackBarAlert";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { getApiUrl } from "../../assets/getApi";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import Fade from "@mui/material/Fade";

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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SendIcon from "@mui/icons-material/Send";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import PayslipsPreview from "./PayslipsPreview.jsx";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import * as XLSX from "xlsx";

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
    const [loading, setLoading] = React.useState(false);

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

    const columns = [
        { field: "id", headerName: "ID", width: 50, editable: false },
        {
            field: "identification",
            headerName: "Cedula",
            width: 110,
            editable: false,
        },
        { field: "name", headerName: "Nombre", width: 250, editable: false },
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
            width: 120,
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
            width: 200,
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
                            icon={<SendIcon />}
                            label="download"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={() => handleClickFile(GridRowParams.id)}
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
            "gross_earnings",
            "healthcare_contribution",
            "pension_contribution",
            "tax_withholding",
            "apsalpen",
            "additional_deductions",
            "total_deductions",
            "net_pay",
        ];

        for (let i = 0; i < lines.length; i++) {
            const obj = { id: i + 1 }; // Add an id field
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
        setLoading(true);

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
                throw new Error(data.detail);
            } else if (response.status === 201) {
                handleCloseDialog();
                setLoading(false);
                getPayslips();
                showSnack("success", "Desprendibles cargados y enviados correctamente");
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            showSnack("error", error.message);
        }
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
                    sx={{ width: "100%" }}
                    columns={columns}
                    toolbar
                    rows={rows}
                ></DataGrid>
            </Container>
            <Dialog fullWidth={true} maxWidth="xl" open={openDialog} onClose={handleCloseDialog}>
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: loading ? "800ms" : "0ms",
                    }}
                    unmountOnExit
                >
                    <LinearProgress />
                </Fade>
                <DialogTitle>Cargar Desprendibles de Nomina</DialogTitle>
                <DialogContent>
                    <Button sx={{ width: "250px", overflow: "hidden", mb: "2rem" }} variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                        {fileName}
                        <VisuallyHiddenInput
                            id="file"
                            name="file"
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={
                                handleFileInputChange
                                // Formik doesn't automatically handle file inputs, so we need to manually
                                // update the 'file' field when a file is selected
                                // formik.setFieldValue("file", event.currentTarget.files[0]);
                            }
                        />
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
