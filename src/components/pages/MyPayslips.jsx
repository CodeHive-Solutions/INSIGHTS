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

import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridActionsCellItem,
    GridToolbar,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const MyPayslips = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem("permissions"));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes("vacancy.view_payslip")) {
            console.log("no tiene permisos");
            // navigate("/logged/home");
        }
    }, []);

    const getVacanciesReferred = async () => {
        try {
            const response = await fetch(`${getApiUrl()}/payslip/`, {
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
        { field: "test", headerName: "Desprendible", width: 500, editable: false },
        {
            field: "test2",
            type: "date",
            headerName: "Fecha de Envió",
            width: 500,
            editable: false,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: "download",
            headerName: "Descargar",
            width: 100,
            type: "actions",
            cellClassName: "actions",
            getActions: (GridRowParams) => {
                return [
                    <Tooltip title="Descargar" arrow>
                        <GridActionsCellItem
                            icon={<FileDownloadIcon />}
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

    const exampleRows = [
        { id: 1, test: "Desprendible 1", test2: "2021-10-10" },
        { id: 2, test: "Desprendible 2", test2: "2021-10-10" },
        { id: 3, test: "Desprendible 3", test2: "2021-10-10" },
        { id: 4, test: "Desprendible 4", test2: "2021-10-10" },
        { id: 5, test: "Desprendible 5", test2: "2021-10-10" },
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
                <DataGrid slots={{ toolbar: GridToolbar }} sx={{ width: "100%" }} columns={columns} toolbar rows={exampleRows}></DataGrid>
            </Container>

            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default MyPayslips;
