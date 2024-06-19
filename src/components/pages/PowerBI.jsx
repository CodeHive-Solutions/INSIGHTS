import React from "react";
import { Box } from "@mui/material";
const PowerBI = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <iframe
                title="BI_Reporte_Operaciones_Diario"
                width="90%"
                height="100%"
                src="https://app.powerbi.com/reportEmbed?reportId=7c2eab11-06c4-407c-8178-2ef5d44123c1&autoAuth=true&ctid=f1f835af-7287-4453-a564-fca7ee9fbf36"
                allowFullScreen={true}
                style={{ border: "none" }}
            ></iframe>
        </Box>
    );
};

export default PowerBI;
