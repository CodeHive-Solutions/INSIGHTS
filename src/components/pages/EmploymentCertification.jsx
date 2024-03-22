import { useState, useEffect } from "react";

// Libraries
import { useNavigate } from "react-router-dom";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";

// Material-UI
import { Container, Typography } from "@mui/material";
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
            const response = await fetch(`${getApiUrl()}/employment-management//`, {
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
        getEmploymentCertifications();
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

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "user", headerName: "Cedula", width: 100 },
        { field: "position", headerName: "Cargo", width: 250, editable: false },
        { field: "salary", headerName: "Salario", width: 150, editable: false },
        { field: "contract_type", headerName: "Contrato", width: 170, editable: false },
        { field: "start_date", headerName: "Fecha de Ingreso", width: 150, editable: false },
        { field: "expedition", headerName: "Lugar de Expedición", width: 200, editable: false },
    ];

    return (
        <>
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
                    Certificaciones Laborales
                </Typography>
                <DataGrid
                    sx={{ width: "100%", minHeight: "83vh", maxHeight: "83vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}
                    columns={columns}
                    rows={rows}
                    slotProps={{
                        toolbar: {
                            csvOptions: {
                                fileName: "employment-certifications",
                                delimiter: ";",
                                utf8WithBom: true,
                            },
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                ></DataGrid>
            </Container>

            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default EmploymentCertification;
