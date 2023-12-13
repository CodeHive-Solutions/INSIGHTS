import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import logo_CYC from "../../images/cyc-logos/logo-footer.webp";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import { useNavigate } from "react-router-dom";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import WebIcon from "@mui/icons-material/Web";

const Footer = () => {
    const navigate = useNavigate();

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
                <img onClick={() => window.open("https://cyc-bpo.com/", "_blank")} src={logo_CYC} style={{ width: 200, cursor: "pointer" }} alt="logo_CYC" />
                <Typography variant="body2" color="white">
                    Calle 19 No. 3 - 16 Piso 3CC Barichara - Bogotá D. C.
                </Typography>
                <Typography variant="body2" color="white">
                    © 2010 - {new Date().getFullYear()}
                </Typography>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                    <WebIcon onClick={() => window.open("https://www.cyc-bpo.com/", "_blank")} sx={{ cursor: "pointer", fontSize: 25, color: "white" }} />
                    <FacebookOutlinedIcon
                        onClick={() => window.open("https://www.facebook.com/cycservicesbpo/", "_blank")}
                        sx={{ cursor: "pointer", fontSize: 25, color: "white" }}
                    />
                    <LinkedInIcon
                        onClick={() => window.open("https://www.linkedin.com/company/c-c-services-sas/", "_blank")}
                        sx={{ cursor: "pointer", fontSize: 25, color: "white" }}
                    />
                    <InstagramIcon
                        onClick={() => window.open("https://instagram.com/cycservicessas?igshid=MzRlODBiNWFlZA==", "_blank")}
                        sx={{ cursor: "pointer", fontSize: 25, color: "white" }}
                    />
                </Box>
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
                <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/logged/about-us")} variant="subtitle2" color="white">
                    Sobre Nosotros
                </Typography>
                <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/logged/blog")} variant="subtitle2" color="white">
                    Blog
                </Typography>
                <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/logged/suggestions")} variant="subtitle2" color="white">
                    PQR
                </Typography>
                <Typography sx={{ cursor: "pointer" }} onClick={() => navigate("/logged/sgc")} variant="subtitle2" color="white">
                    SGC
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;
