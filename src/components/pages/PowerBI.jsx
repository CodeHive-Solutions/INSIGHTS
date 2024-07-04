import React from "react";
import { Box } from "@mui/material";
const PowerBI = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", mt: "2rem" }}>
            <iframe
                title="Tablero_Gestion_Humana_BI"
                width="90%"
                height="80%"
                src="https://app.powerbi.com/reportEmbed?reportId=9b6856c8-0662-47ad-ba15-471ddeee3b92&autoAuth=true&ctid=f1f835af-7287-4453-a564-fca7ee9fbf36"
                style={{ border: "none" }}
                allowFullScreen={true}
            ></iframe>
        </Box>
    );
};

export default PowerBI;
