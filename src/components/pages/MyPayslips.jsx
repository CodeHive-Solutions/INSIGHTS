import React, { useState, useEffect } from "react";

// Material-UI
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
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

    useEffect(() => {
        window.scrollTo(0, 0);
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

    const columns = [
        { field: "id", headerName: "ID", width: 75, editable: false },
        { field: "title", headerName: "Desprendible", width: 350, editable: false },
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
                            onClick={() => handleClickFile(GridRowParams.id)}
                        />
                    </Tooltip>,
                ];
            },
        },
    ];

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
                    sx={{ width: "100%" }}
                    columns={columns}
                    toolbar
                    rows={rows}
                ></DataGrid>
            </Container>

            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default MyPayslips;
