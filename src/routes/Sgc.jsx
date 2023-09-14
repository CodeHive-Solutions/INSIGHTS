import React from "react";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export const Sgc = () => {
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "area", headerName: "Area", width: 70 },
        { field: "tipo", headerName: "Tipo", width: 70 },
        { field: "subtipo", headerName: "Subtipo", width: 70 },
        { field: "nombre", headerName: "Nombre", width: 700 },
        { field: "version", headerName: "Version", width: 70 },
        { field: "archivo", headerName: "Archivo", width: 70 },
    ];

    const rows = [
        { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001", archivo: 1 },
        { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001", archivo: 1 },
        { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001", archivo: 1 },
        { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001", archivo: 1 },
        { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001", archivo: 1 },
        { id: 1, area: "DE", tipo: "MA", subtipo: "F003", nombre: "MATRIZ DE CAMBIOS Y MEJORAS", version: "001", archivo: 1 },
    ];

    return (
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
    );
};

export default Sgc;
