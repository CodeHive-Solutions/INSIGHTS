import { useState, useEffect } from "react";

// Libraries
import { useNavigate } from "react-router-dom";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import { handleError } from "../../assets/handleError";
import { CustomNoResultsOverlay } from "../../assets/CustomNoResultsOverlay";
// Material-UI
import { Container, Typography, Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export const EmploymentCertification = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem("permissions"));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes("employment_management.view_employmentcertification")) {
            navigate("/logged/home");
        }
    }, []);

    const getEmploymentCertifications = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}employment-management/get-employment-certifications`, {
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
        getEmploymentCertifications();
    }, []);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const columns = [
        { field: "cedula", headerName: "Cedula", width: 100 },
        { field: "position", headerName: "Cargo", width: 360, editable: false },
        {
            field: "salary",
            headerName: "Salario",
            type: "number",
            width: 125,
            editable: false,
            valueFormatter: (value) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(value),
        },
        {
            field: "bonuses",
            headerName: "Bonificación",
            width: 125,
            editable: false,
            valueFormatter: (value) =>
                new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                }).format(value),
        },
        { field: "contract_type", headerName: "Contrato", width: 170, editable: false },
        {
            field: "created_at",
            type: "dateTime",
            headerName: "Fecha de Creación",
            width: 170,
            editable: false,
            valueFormatter: (value) => new Date(value).toLocaleString(),
        },
        { field: "start_date", headerName: "Fecha de Ingreso", width: 150, editable: false },
        { field: "expedition_city", headerName: "Lugar de Expedición", width: 180, editable: false },
    ];

    return (
        <>
            <Container
                sx={{
                    marginTop: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                    Certificaciones Laborales
                </Typography>
                <Box sx={{ height: "80vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}>
                    <DataGrid
                        loading={rows.length === 0}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "created_at", sort: "desc" }],
                            },
                        }}
                        columns={columns}
                        rows={rows}
                        slots={{ toolbar: GridToolbar, noResultsOverlay: CustomNoResultsOverlay }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                csvOptions: {
                                    fileName: "employment-certifications",
                                    delimiter: ";",
                                    utf8WithBom: true,
                                },
                            },
                            loadingOverlay: {
                                variant: "skeleton",
                                noRowsVariant: "skeleton",
                            },
                        }}
                    ></DataGrid>
                </Box>
            </Container>

            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default EmploymentCertification;
