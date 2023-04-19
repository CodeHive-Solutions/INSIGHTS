import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const NavBar = () => {
    return (
        <Box position="fixed" sx={{ backgroundColor: "white", width: "100%" }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 400 }}>
                    INSIGHTS
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ flexGrow: 1, fontWeight: 400 }}
                >
                    Formularios
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ flexGrow: 1, fontWeight: 400 }}
                >
                    Blog
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ flexGrow: 1, fontWeight: 400 }}
                >
                    SGC
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ flexGrow: 1, fontWeight: 400 }}
                >
                    Sobre Nosotros
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ flexGrow: 1, fontWeight: 400 }}
                >
                    Formularios
                </Typography>
            </Toolbar>
        </Box>
    );
};

export default NavBar;
