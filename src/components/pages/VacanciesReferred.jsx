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
    GridToolbarFilterButton,
} from "@mui/x-data-grid";

// icons
import DeleteIcon from "@mui/icons-material/Delete";

export const VacanciesReferred = () => {
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
        if (!permissions || !permissions.includes("vacancy.view_reference")) {
            navigate("/logged/home");
        }
    }, []);

    const getVacanciesReferred = async () => {
        try {
            const response = await fetch(`${getApiUrl()}/vacancy/reference/`, {
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

    const handleOpenDialog = () => setOpenDialog(true);

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const handleDeleteClick = async (id) => {
        try {
            const response = await fetch(`${getApiUrl()}vacancy/reference/${id}`, {
                method: "delete",
                credentials: "include",
            });
            if (response.status === 204) {
                setRows(rows.filter((row) => row.id !== id));
                getVacanciesReferred();
                showSnack("success", "Se ha eliminado el registro correctamente.");
            } else {
                showSnack("error", "Error al eliminar el registro");
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
            setSnackbarMessage("Error al eliminar la meta: " + error.message);
        }
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: "vacantes-referidas",
                        delimiter: ";",
                        utf8WithBom: true,
                    }}
                />
                {permissions && permissions.includes("contracts.add_contract") ? (
                    <Button size="small" onClick={handleOpenDialog} startIcon={<PersonAddAlt1Icon />}>
                        AÑADIR
                    </Button>
                ) : null}
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "created_by", headerName: "Persona que refirió", width: 250, editable: false },
        { field: "name", headerName: "Nombre del Referido", width: 250, editable: false },
        { field: "phone_number", headerName: "Numero del Referido", width: 170, editable: false },
        { field: "vacancy", headerName: "Vacante", width: 400, editable: false },
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
                    Vacantes referidas
                </Typography>
                <DataGrid
                    sx={{ width: "100%" }}
                    columns={columns}
                    rows={rows}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                ></DataGrid>
            </Container>

            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default VacanciesReferred;
