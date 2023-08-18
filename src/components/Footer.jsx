import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import logo_CYC from "../images/logo-cyc.webp";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";

const Footer = () => {

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "primary.main",
                display: "flex",
                padding: "25px",
                marginTop: "15px",
                justifyContent: "space-evenly",
                gap: "2rem",
                flexWrap: "wrap",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "Column", gap: "15px" }}>
                <img src={logo_CYC} style={{ width: 200 }} alt="logo_CYC" />

                <Typography variant="body2" color="white">
                    Calle 19 No. 3 – 16 Piso 3CC Barichara – Bogotá D. C.
                </Typography>
                <Typography variant="body2" color="white">
                    © 2010 - {new Date().getFullYear()}
                </Typography>
                <FacebookOutlinedIcon sx={{ fontSize: 35, color: "white" }} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", width: "350px" }}>
                <Typography variant="body2" color="white">
                    Al acceder a la intranet de C&C SERVICES S.A.S, usted acepta respetar la confidencialidad, la ética y la legalidad de la información que maneja, así
                    como cumplir con las políticas y normas internas de la empresa. C&C SERVICES S.A.S se reserva el derecho de monitorear y restringir su acceso a la
                    intranet por motivos de seguridad o incumplimiento.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "15px",
                }}
            >
                <Typography variant="subtitle2" color="white">
                    Sobre Nosotros
                </Typography>
                <Typography variant="subtitle2" color="white">
                    Blog
                </Typography>
                <Typography variant="subtitle2" color="white">
                    PQR
                </Typography>
                <Typography variant="subtitle2" color="white">
                    SGC
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;
