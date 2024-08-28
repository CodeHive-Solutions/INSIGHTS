import { useState, useEffect, useRef } from "react";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../assets/handleError";
import { CustomNoResultsOverlay } from "../../assets/CustomNoResultsOverlay";

// Material-UI
import { Container, Typography, Box, TextField, MenuItem, Button } from "@mui/material";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";

const AnalisisMetas = () => {
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");
    const [rows, setRows] = useState([]);
    const [yearsArray, setYearsArray] = useState([]);
    const monthRef = useRef();
    const yearRef = useRef();
    const goalType = useRef(null);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem("permissions"));

    useEffect(() => {
        if (!permissions || !permissions.includes("goals.view_goals")) {
            navigate("/logged/home");
        }
    }, []);

    const modifyData = (data) => {
        const modifiedData = data.map((row) => {
            const date_update = row.last_update ? "last_update" : "history_date";
            if (row.quantity_goal > 999) {
                const formatter = new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                });
                const value = row.quantity_goal;
                const formattedValue = formatter.format(value);
                row.quantity_goal = formattedValue;
            } else if (row.quantity_goal < 1) {
                row.quantity_goal = Math.round(row.quantity_goal * 100) + "%";
            }
            return {
                ...row,
                [date_update]: row[date_update].substring(0, 10),
                accepted: row.accepted == 0 ? "Rechazada" : row.accepted == 1 ? "Aceptada" : "En espera",
                clean_desk: row.clean_desk === "" ? "En Espera" : row.clean_desk,
                quality: row.quality === "" ? "En Espera" : row.quality,
                result: row.result === "" ? "En Espera" : row.result,
                total: row.total === "" ? "En Espera" : row.total,
                accepted_execution:
                    row.total == "" && row.accepted_execution == null
                        ? ""
                        : row.accepted_execution == 0
                        ? "Rechazada"
                        : row.accepted_execution == 1
                        ? "Aceptada"
                        : "En espera",
            };
        });

        setRows(modifiedData);
    };

    const getGoals = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}goals`, {
                method: "GET",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                modifyData(data);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getGoals();
    }, []);

    const goalsColumns = [
        { field: "cedula", headerName: "Cedula", width: 200 },
        { field: "quantity_goal", headerName: "Meta", width: 240 },
        { field: "last_update", headerName: "Fecha de modificación", width: 255 },
        { field: "accepted", headerName: "Aprobación Meta", width: 225 },
        {
            field: "goal_date",
            headerName: "Fecha de la meta",
            width: 150,
            sortComparator: (v1, v2) => {
                // Extraer el mes y el año de los valores
                const [mes1, año1] = v1.split("-");
                const [mes2, año2] = v2.split("-");
                // Crear un objeto con los nombres de los meses en español y sus números correspondientes
                const meses = {
                    ENERO: 1,
                    FEBRERO: 2,
                    MARZO: 3,
                    ABRIL: 4,
                    MAYO: 5,
                    JUNIO: 6,
                    JULIO: 7,
                    AGOSTO: 8,
                    SEPTIEMBRE: 9,
                    OCTUBRE: 10,
                    NOVIEMBRE: 11,
                    DICIEMBRE: 12,
                };
                // Convertir los meses a números
                const num1 = meses[mes1];
                const num2 = meses[mes2];
                // Comparar los años primero, y si son iguales, comparar los meses
                if (año1 < año2) {
                    return -1;
                } else if (año1 > año2) {
                    return 1;
                } else {
                    if (num1 < num2) {
                        return -1;
                    } else if (num1 > num2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
        },
    ];

    const executionColumns = [
        { field: "cedula", headerName: "Cedula", width: 100 },
        { field: "quantity_execution", headerName: "Meta", width: 140 },
        { field: "clean_desk", headerName: "Clean Desk", width: 100 },
        { field: "quality", headerName: "Calidad", width: 80 },
        { field: "result", headerName: "Resultado", width: 100 },
        { field: "total", headerName: "Total", width: 80 },
        { field: "last_update", headerName: "Fecha de modificación", width: 180 },
        { field: "accepted_execution", headerName: "Aprobación", width: 170 },
        {
            field: "execution_date",
            headerName: "Mes de la ejecución",
            width: 180,
            sortComparator: (v1, v2) => {
                // Extraer el mes y el año de los valores
                const [mes1, año1] = v1.split("-");
                const [mes2, año2] = v2.split("-");
                // Crear un objeto con los nombres de los meses en español y sus números correspondientes
                const meses = {
                    ENERO: 1,
                    FEBRERO: 2,
                    MARZO: 3,
                    ABRIL: 4,
                    MAYO: 5,
                    JUNIO: 6,
                    JULIO: 7,
                    AGOSTO: 8,
                    SEPTIEMBRE: 9,
                    OCTUBRE: 10,
                    NOVIEMBRE: 11,
                    DICIEMBRE: 12,
                };
                // Convertir los meses a números
                const num1 = meses[mes1];
                const num2 = meses[mes2];
                // Comparar los años primero, y si son iguales, comparar los meses
                if (año1 < año2) {
                    return -1;
                } else if (año1 > año2) {
                    return 1;
                } else {
                    if (num1 < num2) {
                        return -1;
                    } else if (num1 > num2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
        },
    ];

    const [columns, setColumns] = useState(goalsColumns);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnack(false);
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: "Metas",
                        delimiter: ";",
                        utf8WithBom: true,
                    }}
                />
                <Box sx={{ textAlign: "end", flex: "1" }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    }

    const months = [
        { value: "ENERO", label: "ENERO" },
        { value: "FEBRERO", label: "FEBRERO" },
        { value: "MARZO", label: "MARZO" },
        { value: "ABRIL", label: "ABRIL" },
        { value: "MAYO", label: "MAYO" },
        { value: "JUNIO", label: "JUNIO" },
        { value: "JULIO", label: "JULIO" },
        { value: "AGOSTO", label: "AGOSTO" },
        { value: "SEPTIEMBRE", label: "SEPTIEMBRE" },
        { value: "OCTUBRE", label: "OCTUBRE" },
        { value: "NOVIEMBRE", label: "NOVIEMBRE" },
        { value: "DICIEMBRE", label: "DICIEMBRE" },
    ];

    useEffect(() => {
        const YearSelect = () => {
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let year = 2023; year <= currentYear; year++) {
                years.push({ value: year, label: year });
            }
            setYearsArray(years);
        };

        YearSelect();
    }, []);

    const handleFilter = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${getApiUrl().apiUrl}goals/?date=${monthRef.current.value}-${yearRef.current.value}&column=${goalType.current.value}`, {
                method: "GET",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();

                // Create a new columns array based on the initial columns but with the field name changed
                let currentColumns = [];
                if (goalType.current.value === "delivery") {
                    currentColumns = goalsColumns;
                } else if (goalType.current.value === "execution") {
                    currentColumns = executionColumns;
                }

                const updatedColumns = currentColumns.map((column) => {
                    if (column.field === "last_update") {
                        // Change the field and header name for 'last_update' column
                        return {
                            ...column,
                            field: "history_date",
                            headerName: "Fecha de modificación",
                        };
                    }
                    return column; // Keep other columns unchanged
                });

                // // Update the 'columns' state with the modified columns
                setColumns(updatedColumns);
                modifyData(data);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    const handleTypeGoalChange = (event) => {
        const selectedValue = event.target.value;
        // Perform actions based on the selected value
        if (selectedValue === "delivery" && monthRef.current.value === "" && yearRef.current.value === "") {
            setColumns(goalsColumns);
        } else if (selectedValue === "execution" && monthRef.current.value === "" && yearRef.current.value === "") {
            setColumns(executionColumns);
        }
    };

    const showSnack = (message, severity) => {
        setMessage(message);
        setSeverity(severity);
        setOpenSnack(true);
    };

    return (
        <Container
            sx={{
                mt: "6rem",
            }}
        >
            <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h4"}>
                Análisis de Metas
            </Typography>
            <Box sx={{ display: "flex", gap: "2rem", p: "1rem" }}>
                <Box>
                    <TextField
                        onChange={handleTypeGoalChange}
                        required
                        defaultValue="delivery"
                        sx={{ width: "10rem" }}
                        size="small"
                        variant="filled"
                        select
                        label="Tipo de meta"
                        inputRef={goalType}
                    >
                        <MenuItem value={"delivery"}>Entrega</MenuItem>
                        <MenuItem value={"execution"}>Ejecución</MenuItem>
                    </TextField>
                </Box>
                <Box component="form" sx={{ display: "flex", gap: "1rem", justifyContent: "flex-end", width: "100%" }} onSubmit={handleFilter}>
                    <TextField id="month" label="Mes" required defaultValue="" sx={{ width: "9rem" }} size="small" variant="filled" select inputRef={monthRef}>
                        {months.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Año" required defaultValue="" sx={{ width: "9rem" }} size="small" variant="filled" select inputRef={yearRef}>
                        {yearsArray.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button variant="outlined" size="small" type="submit">
                        Filtrar
                    </Button>
                </Box>
            </Box>
            <Box sx={{ height: "70vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}>
                <DataGrid
                    loading={rows.length === 0}
                    rows={rows}
                    columns={columns}
                    csvOptions={{
                        fileName: "Metas",
                        delimiter: ";",
                        utf8WithBom: true,
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
                    getRowId={(row) => row.cedula}
                />
            </Box>
            <SnackbarAlert open={openSnack} onClose={handleCloseSnackbar} severity={severity} message={message} />
        </Container>
    );
};
export default AnalisisMetas;
