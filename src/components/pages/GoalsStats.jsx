import { useState, useEffect, useCallback, useRef } from "react";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import { useNavigate } from "react-router-dom";

// Material-UI
import { Container, Typography, Box, TextField, MenuItem, Button } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
    GridToolbarQuickFilter,
    GridRowModes,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";

// Icons
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const AnalisisMetas = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [coordinator, setCoordinator] = useState("");
    const [selectedOption, setSelectedOption] = useState("delivery");
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [yearsArray, setYearsArray] = useState([]); // Add a loading state
    const [open, setOpen] = useState(false);
    const [link, setLink] = useState();
    const handleClose = () => setOpen(false);
    const monthRef = useRef();
    const yearRef = useRef();
    const goalType = useRef(null);
    const navigate = useNavigate();
    const cedula = JSON.parse(localStorage.getItem("cedula"));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!cedula.includes("28172713") && !cedula.includes("1001185389") && !cedula.includes("1020780559") && !cedula.includes("25878771")) {
            navigate("/logged/home");
        }
    }, []);

    const handleSave = async () => {
        try {
            const response = await fetch(`${getApiUrl()}goals`, {
                method: "GET",
            });

            if (!response.ok) {
                if (response.status === 500) {
                    console.error("Lo sentimos, se ha producido un error inesperado.");
                    setOpenSnackbar(true);
                    setSnackbarSeverity("error");
                    setSnackbarMessage("Lo sentimos, se ha producido un error inesperado");
                    throw new Error(response.statusText);
                } else if (response.status === 400) {
                    const data = await response.json();
                    console.error("Lo sentimos, se ha producido un error inesperado.");
                    setOpenSnackbar(true);
                    setSnackbarSeverity("error");
                    setSnackbarMessage(data.message);
                    throw new Error(response.statusText);
                }

                const data = await response.json();
                console.error("Message: " + data.message + " Asesor: " + data.Asesor + " Error: " + data.error);
                setOpenSnackbar(true);
                setSnackbarSeverity("error");
                setSnackbarMessage("Message: " + data.message + " Asesor: " + data.Asesor + " Error: " + data.error);
                throw new Error(response.statusText);
            }

            if (response.status === 200) {
                const data = await response.json();
                const modifiedData = data.map((row) => {
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
                        last_update: row.last_update.substring(0, 10),
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
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleSave();
    }, [coordinator]); // Add cedula and coordinator as dependencies to useEffect

    const handleDeleteClick = async (register_cedula) => {
        try {
            const response = await fetch(`${getApiUrl()}goals/${register_cedula}`, {
                method: "DELETE",
                body: JSON.stringify({ cedula: cedula }),
            });
            if (response.status === 204) {
                setRows(rows.filter((row) => row.cedula !== register_cedula));
                setOpenSnackbar(true);
                setSnackbarSeverity("success");
                setSnackbarMessage("Registro eliminado correctamente");
                handleSave();
            } else {
                setOpenSnackbar(true);
                setSnackbarSeverity("error");
                setSnackbarMessage("Error al eliminar la meta: " + response.status + " " + response.statusText);
            }
        } catch (error) {
            console.error(error);
            setOpenSnackbar(true);
            setSnackbarSeverity("error");
            setSnackbarMessage("Error al eliminar la meta: " + error.message);
        }
    };

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
        // {
        //     field: "actions",
        //     type: "actions",
        //     headerName: "Acciones",
        //     width: 100,
        //     cellClassName: "actions",
        //     getActions: ({ id }) => {
        //         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        //         if (isInEditMode) {
        //             return [
        //                 <GridActionsCellItem
        //                     icon={<SaveOutlinedIcon />}
        //                     label="Save"
        //                     key={id}
        //                     sx={{
        //                         color: "primary.main",
        //                     }}
        //                     onClick={handleSaveClick(id)}
        //                 />,
        //                 <GridActionsCellItem key={id} icon={<CancelOutlinedIcon />} label="Cancel" className="textPrimary" onClick={handleCancelClick(id)} />,
        //             ];
        //         }

        //         return [
        //             <GridActionsCellItem key={id} icon={<EditOutlinedIcon />} label="Edit" onClick={handleEditClick(id)} />,
        //             <GridActionsCellItem key={id} icon={<DeleteOutlineOutlinedIcon />} label="Delete" onClick={() => handleDeleteClick(id)} />,
        //         ];
        //     },
        // },
    ];
    // const initialColumns = [
    //     { field: "cedula", headerName: "Cedula", width: 100 },
    //     { field: "quantity", headerName: "Meta", width: 140, editable: true },
    //     { field: "clean_desk", headerName: "Clean Desk", width: 80, editable: true },
    //     { field: "quality", headerName: "Calidad", width: 80, editable: true },
    //     { field: "result", headerName: "Resultado", width: 80, editable: true },
    //     { field: "total", headerName: "Total", width: 80, editable: true },
    //     { field: "last_update", headerName: "Fecha de modificación", width: 155 },
    //     { field: "accepted", headerName: "Aprobación Meta", width: 125 },
    //     { field: "accepted_execution", headerName: "Aprobación Ejecución", width: 150 },
    //     {
    //         field: "goal_date",
    //         headerName: "Fecha de la meta",
    //         width: 150,
    //         sortComparator: (v1, v2) => {
    //             // Extraer el mes y el año de los valores
    //             const [mes1, año1] = v1.split("-");
    //             const [mes2, año2] = v2.split("-");
    //             // Crear un objeto con los nombres de los meses en español y sus números correspondientes
    //             const meses = {
    //                 ENERO: 1,
    //                 FEBRERO: 2,
    //                 MARZO: 3,
    //                 ABRIL: 4,
    //                 MAYO: 5,
    //                 JUNIO: 6,
    //                 JULIO: 7,
    //                 AGOSTO: 8,
    //                 SEPTIEMBRE: 9,
    //                 OCTUBRE: 10,
    //                 NOVIEMBRE: 11,
    //                 DICIEMBRE: 12,
    //             };
    //             // Convertir los meses a números
    //             const num1 = meses[mes1];
    //             const num2 = meses[mes2];
    //             // Comparar los años primero, y si son iguales, comparar los meses
    //             if (año1 < año2) {
    //                 return -1;
    //             } else if (año1 > año2) {
    //                 return 1;
    //             } else {
    //                 if (num1 < num2) {
    //                     return -1;
    //                 } else if (num1 > num2) {
    //                     return 1;
    //                 } else {
    //                     return 0;
    //                 }
    //             }
    //         },
    //     },
    //     {
    //         field: "execution_date",
    //         headerName: "Fecha de la ejecucion de la meta",
    //         width: 150,
    //         sortComparator: (v1, v2) => {
    //             // Extraer el mes y el año de los valores
    //             const [mes1, año1] = v1.split("-");
    //             const [mes2, año2] = v2.split("-");
    //             // Crear un objeto con los nombres de los meses en español y sus números correspondientes
    //             const meses = {
    //                 ENERO: 1,
    //                 FEBRERO: 2,
    //                 MARZO: 3,
    //                 ABRIL: 4,
    //                 MAYO: 5,
    //                 JUNIO: 6,
    //                 JULIO: 7,
    //                 AGOSTO: 8,
    //                 SEPTIEMBRE: 9,
    //                 OCTUBRE: 10,
    //                 NOVIEMBRE: 11,
    //                 DICIEMBRE: 12,
    //             };
    //             // Convertir los meses a números
    //             const num1 = meses[mes1];
    //             const num2 = meses[mes2];
    //             // Comparar los años primero, y si son iguales, comparar los meses
    //             if (año1 < año2) {
    //                 return -1;
    //             } else if (año1 > año2) {
    //                 return 1;
    //             } else {
    //                 if (num1 < num2) {
    //                     return -1;
    //                 } else if (num1 > num2) {
    //                     return 1;
    //                 } else {
    //                     return 0;
    //                 }
    //             }
    //         },
    //     },
    //     // {
    //     //     field: "actions",
    //     //     type: "actions",
    //     //     headerName: "Acciones",
    //     //     width: 100,
    //     //     cellClassName: "actions",
    //     //     getActions: ({ id }) => {
    //     //         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    //     //         if (isInEditMode) {
    //     //             return [
    //     //                 <GridActionsCellItem
    //     //                     icon={<SaveOutlinedIcon />}
    //     //                     label="Save"
    //     //                     key={id}
    //     //                     sx={{
    //     //                         color: "primary.main",
    //     //                     }}
    //     //                     onClick={handleSaveClick(id)}
    //     //                 />,
    //     //                 <GridActionsCellItem key={id} icon={<CancelOutlinedIcon />} label="Cancel" className="textPrimary" onClick={handleCancelClick(id)} />,
    //     //             ];
    //     //         }

    //     //         return [
    //     //             <GridActionsCellItem key={id} icon={<EditOutlinedIcon />} label="Edit" onClick={handleEditClick(id)} />,
    //     //             <GridActionsCellItem key={id} icon={<DeleteOutlineOutlinedIcon />} label="Delete" onClick={() => handleDeleteClick(id)} />,
    //     //         ];
    //     //     },
    //     // },
    // ];

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
        // {
        //     field: "actions",
        //     type: "actions",
        //     headerName: "Acciones",
        //     width: 100,
        //     cellClassName: "actions",
        //     getActions: ({ id }) => {
        //         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        //         if (isInEditMode) {
        //             return [
        //                 <GridActionsCellItem
        //                     icon={<SaveOutlinedIcon />}
        //                     label="Save"
        //                     key={id}
        //                     sx={{
        //                         color: "primary.main",
        //                     }}
        //                     onClick={handleSaveClick(id)}
        //                 />,
        //                 <GridActionsCellItem key={id} icon={<CancelOutlinedIcon />} label="Cancel" className="textPrimary" onClick={handleCancelClick(id)} />,
        //             ];
        //         }

        //         return [
        //             <GridActionsCellItem key={id} icon={<EditOutlinedIcon />} label="Edit" onClick={handleEditClick(id)} />,
        //             <GridActionsCellItem key={id} icon={<DeleteOutlineOutlinedIcon />} label="Delete" onClick={() => handleDeleteClick(id)} />,
        //         ];
        //     },
        // },
    ];

    const [columns, setColumns] = useState(goalsColumns);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleProcessRowUpdateError = useCallback((error) => {
        console.error(error);
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.message);
    }, []);

    const processRowUpdate = useCallback(async (newRow) => {
        if (newRow.quantity.includes("%")) {
            newRow.quantity = parseFloat(newRow.quantity.replace("%", "")) / 100;
        } else {
            const formattedValue = newRow.quantity;
            const value = parseInt(formattedValue.replace(/\D/g, ""), 10);
            newRow.quantity = value;
        }

        // Format the date value
        const fields = ["clean_desk", "quality", "result", "total"];
        fields.forEach((field) => {
            if (newRow[field] === "En Espera") {
                newRow[field] = "";
            }
        });

        // Format the accepted value
        const mapValues = (value) => {
            if (value === "Rechazada") return 0;
            if (value === "Aceptada") return 1;
            if (value === "En espera") return null;
            return value;
        };

        newRow.accepted = mapValues(newRow.accepted);
        newRow.accepted_execution = mapValues(newRow.accepted_execution);
        newRow.result = mapValues(newRow.result);

        // Make the HTTP request to save in the backend
        const newRowWithCedula = { ...newRow, cedula: cedula };
        try {
            const response = await fetch(`${getApiUrl()}goals/${newRow.cedula}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newRowWithCedula),
            });

            if (!response.ok) {
                const data = await response.json();
                console.error(data);
                throw new Error(response.statusText);
            } else if (response.status === 200) {
                const data = await response.json();
                setOpenSnackbar(true);
                setSnackbarSeverity("success");
                setSnackbarMessage("Meta actualizada correctamente");
                handleSave();
                return data;
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

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

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

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
            const response = await fetch(`${getApiUrl()}goals/?date=${monthRef.current.value}-${yearRef.current.value}&column=${goalType.current.value}`, {
                method: "GET",
            });

            if (!response.ok) {
                if (response.status === 500) {
                    console.error("Lo sentimos, se ha producido un error inesperado.");
                    setOpenSnackbar(true);
                    setSnackbarSeverity("error");
                    setSnackbarMessage("Lo sentimos, se ha producido un error inesperado");
                    throw new Error(response.statusText);
                } else if (response.status === 400) {
                    const data = await response.json();
                    console.error("Lo sentimos, se ha producido un error inesperado.");
                    setOpenSnackbar(true);
                    setSnackbarSeverity("error");
                    setSnackbarMessage(data.message);
                    throw new Error(response.statusText);
                }

                const data = await response.json();
                console.error("Message: " + data.message + " Asesor: " + data.Asesor + " Error: " + data.error);
                setOpenSnackbar(true);
                setSnackbarSeverity("error");
                setSnackbarMessage("Message: " + data.message + " Asesor: " + data.Asesor + " Error: " + data.error);
                throw new Error(response.statusText);
            }

            if (response.status === 200) {
                const data = await response.json();
                /* just wait he is going to sleep in the lunch time I think, after that he will be okay */
                const modifiedData = data.map((row) => {
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
                        history_date: row.history_date.substring(0, 10),
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
                setRows(modifiedData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleTypeGoalChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        // Perform actions based on the selected value
        if (selectedValue === "delivery" && monthRef.current.value === "" && yearRef.current.value === "") {
            setColumns(goalsColumns);
        } else if (selectedValue === "execution" && monthRef.current.value === "" && yearRef.current.value === "") {
            setColumns(executionColumns);
        }
    };

    return (
        <>
            {isLoading ? (
                <Container
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        marginTop: "1rem",
                        pt: "5rem",
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
                    <DataGrid
                        sx={{ width: "100%", minHeight: "75vh", maxHeight: "75vh", boxShadow: "0px 0px 5px 0px #e0e0e0", borderRadius: "10px" }}
                        rows={rows}
                        editMode="row"
                        columns={columns}
                        csvOptions={{
                            fileName: "customerDataBase",
                            delimiter: ";",
                            utf8WithBom: true,
                        }}
                        rowModesModel={rowModesModel}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        onRowModesModelChange={handleRowModesModelChange}
                        onProcessRowUpdateError={handleProcessRowUpdateError}
                        slots={{
                            toolbar: CustomToolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                setRows,
                                setRowModesModel,
                            },
                        }}
                        getRowId={(row) => row.cedula}
                    />
                    <SnackbarAlert open={openSnackbar} onClose={handleCloseSnackbar} severity={snackbarSeverity} message={snackbarMessage} />
                </Container>
            ) : (
                (window.location.href = "https://intranet.cyc-bpo.com/")
            )}
        </>
    );
};
export default AnalisisMetas;
