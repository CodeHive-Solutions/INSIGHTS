import React from "react";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { motion, useIsPresent } from "framer-motion";
import "../../index.css";
import { useEffect } from "react";

export const Sgc = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isPresent = useIsPresent();
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "area", headerName: "Area", width: 70 },
        { field: "tipo", headerName: "Tipo", width: 70 },
        { field: "subtipo", headerName: "Subtipo", width: 70 },
        { field: "nombre", headerName: "Nombre", width: 700 },
        { field: "version", headerName: "Version", width: 70 },
        {
            field: "archivo",
            headerName: "Archivo",
            width: 100,
            type: "actions",
            cellClassName: "actions",
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<FileDownloadIcon />}
                    label="Save"
                    sx={{
                        color: "primary.main",
                    }}
                />,
            ],
        },
    ];

    const rows = [
        { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
        { id: 2, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
        { id: 3, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
        { id: 4, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
        { id: 5, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
        { id: 6, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001" },
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
                <DataGrid sx={{ width: "100%" }} columns={columns} rows={rows}></DataGrid>
            </Container>
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
                exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
                style={{ originX: isPresent ? 0 : 1 }}
                className="privacy-screen"
            />
        </>
    );
};

export default Sgc;
