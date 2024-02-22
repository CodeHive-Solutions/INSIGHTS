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

export const Payslips = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const [openDialog, setOpenDialog] = useState(false);
    const [fileName, setFileName] = useState("Subir archivo");
    const [fileImage, setFileImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes("vacancy.view_payslip")) {
            console.log("no tiene permisos");
            // navigate("/logged/home");
        }
    }, []);

    const getVacanciesReferred = async () => {
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
        getVacanciesReferred();
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
            field: "identifier",
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
        { field: "fortnight", headerName: "Quincena", width: 300, editable: false },
        { field: "send_to", headerName: "Enviado a", width: 270, editable: false },
        {
            field: "date_sent",
            type: "date",
            headerName: "Fecha de envió",
            width: 100,
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
        setFileImage(null);
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

    const exampleRows = [
        {
            id: 1,
            identifier: "1001185389",
            name: "Juan Sebastian Carreño Daza",
            area: "Gerencia de Tecnología",
            fortnight: "SEGUNDA QUINCENA MES DE ENERO 2024",
            send_to: "carrenosebastian54@gmail.com",
            date_sent: "2021-10-10",
        },
        {
            id: 2,
            identifier: "1001185389",
            name: "Juan Sebastian Carreño Daza",
            area: "Gerencia de Tecnología",
            fortnight: "SEGUNDA QUINCENA MES DE ENERO 2024",
            send_to: "",
            date_sent: "2021-10-10",
        },
        {
            id: 3,
            identifier: "1001185389",
            name: "Juan Sebastian Carreño Daza",
            area: "Gerencia de Tecnología",
            fortnight: "SEGUNDA QUINCENA MES DE ENERO 2024",
            send_to: "",
            date_sent: "2021-10-10",
        },
        {
            id: 4,
            identifier: "1001185389",
            name: "Juan Sebastian Carreño Daza",
            area: "Gerencia de Tecnología",
            fortnight: "SEGUNDA QUINCENA MES DE ENERO 2024",
            send_to: "",
            date_sent: "2021-10-10",
        },
    ];

    const handleFileInputChange = (event) => {
        setFileName(event.target.files[0].name);
        setFileImage(event.target.files[0]);
    };

    const submitPayslipFile = async () => {
        try {
            const formData = new FormData();
            formData.append("file", fileImage);
            const response = await fetch(`${getApiUrl()}payslips/`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail);
            } else if (response.status === 201) {
                showSnack("success", "Archivo cargado correctamente");
                setOpenDialog(false);
                getVacanciesReferred();
            }
        } catch (error) {
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
                            sortModel: [{ field: "date_sent", sort: "desc" }],
                        },
                    }}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    sx={{ width: "100%" }}
                    columns={columns}
                    toolbar
                    rows={exampleRows}
                ></DataGrid>
            </Container>
            <Dialog fullWidth={true} maxWidth="xs" open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Cargar nuevo archivo</DialogTitle>
                <DialogContent>
                    <Button sx={{ width: "100%", overflow: "hidden" }} variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
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
                    <Button onClick={submitPayslipFile} type="submit" startIcon={<SaveIcon></SaveIcon>}>
                        Guardar
                    </Button>
                </DialogContent>
            </Dialog>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Payslips;
