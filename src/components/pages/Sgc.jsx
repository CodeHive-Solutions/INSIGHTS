import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, useIsPresent } from "framer-motion";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import SnackbarAlert from "../common/SnackBarAlert";

import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";

// icons
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import "../../index.css";

const initialRows = [
    { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 2, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 3, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 4, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 5, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
    { id: 6, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
];

export const Sgc = () => {
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState(initialRows);
    const hiddenFileInput = useRef(null);
    const isPresent = useIsPresent();
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
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

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
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

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        showSnack("success", "Se ha actualizado la fila correctamente.");
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleProcessRowUpdateError = useCallback((error) => {
        console.log(error);
        showSnack("error", error.message, true);
        // setSnackbar({ children: error.message, severity: "error" });
    }, []);

    const handleClickFile = (id) => {
        hiddenFileInput.current.click();
        console.log(id);
    };

    const handleFileChange = (event) => {
        const fileUploaded = event.target.files[0];
        // Now you can use the fileUploaded object for further processing
        console.log(fileUploaded);
        showSnack("success", "Se ha cargado el archivo correctamente.");
    };

    const CustomToolbar = () => {
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
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "area",
            headerName: "Area",
            width: 70,
            type: "singleSelect",
            editable: true,
            valueOptions: ["DE", "GA", "GC", "GH", "GL", "GP", "GR", "GS", "GT", "SG-SST"],
        },

        { field: "tipo", headerName: "Tipo", width: 70, type: "singleSelect", editable: true, valueOptions: ["CR", "IN", "MA", "P", "PL", "PR", "RG"] },
        { field: "subtipo", headerName: "Subtipo", width: 70, editable: true },
        { field: "nombre", headerName: "Nombre", width: 600, editable: true },
        { field: "version", headerName: "Version", width: 70, editable: true },
        {
            field: "archivo",
            headerName: "Archivo",
            width: 100,
            type: "actions",
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <>
                            <input type="file" ref={hiddenFileInput} onChange={handleFileChange} style={{ display: "none" }} />
                            <GridActionsCellItem
                                icon={<UploadFileIcon />}
                                label="Save"
                                sx={{
                                    color: "primary.main",
                                }}
                                onClick={() => handleClickFile(id)}
                            />
                        </>,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<FileDownloadIcon />}
                        label="Save"
                        sx={{
                            color: "primary.main",
                        }}
                    />,
                ];
            },
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 100,
            type: "actions",
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            sx={{
                                color: "primary.main",
                            }}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem icon={<EditIcon />} label="Editar" onClick={handleEditClick(id)} />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Eliminar" onClick={handleDeleteClick(id)} />,
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
                    Sistema de Gestión de Calidad
                </Typography>
                <DataGrid
                    sx={{ width: "100%" }}
                    columns={columns}
                    rows={rows}
                    editMode="row"
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    rowModesModel={rowModesModel}
                    onRowEditStop={handleRowEditStop}
                    onRowModesModelChange={handleRowModesModelChange}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                ></DataGrid>
            </Container>
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
                exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
                style={{ originX: isPresent ? 0 : 1 }}
                className="privacy-screen"
            />
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Sgc;
