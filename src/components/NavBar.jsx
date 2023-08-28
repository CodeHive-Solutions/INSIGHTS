import { React, useState, useEffect, useRef } from "react";
import { Box, Typography, MenuItem, Menu, Tooltip, IconButton, Avatar, Divider, ListItemIcon, Button, TextField, Link } from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import FeedIcon from "@mui/icons-material/Feed";
import { useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ArticleIcon from "@mui/icons-material/Article";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import { useNavigate } from "react-router-dom";
import logotipo from "../images/logotipo-navbar - copia.png";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const openMenu = Boolean(anchorElMenu);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClickMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isMobile = useMediaQuery("(max-width: 600px)");

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    backdropFilter: "blur(10px)",
                    zIndex: 1000,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        padding: "1rem 0",
                        backgroundColor: "rgba(255,255,255, 0.9)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    {/* <Typography
                        variant="h5"
                        color="primary"
                        onClick={() => navigate("/loged/home", { replace: true })}
                        sx={{ minWidth: 100, cursor: "pointer", fontWeight: "500", fontFamily: "Poppins" }}
                    >
                        INSIGHTS
                    </Typography> */}
                    <img style={{ cursor: "pointer" }} width={110} src={logotipo} alt="" onClick={() => navigate("/loged/home", { replace: true })} />
                    {isMobile ? (
                        <IconButton onClick={handleClickMenu} size="small">
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <>
                            <Typography sx={{ minWidth: 100, cursor: "pointer" }}>Formularios</Typography>
                            <Typography sx={{ minWidth: 100, cursor: "pointer" }}>Blog</Typography>
                            <Typography sx={{ minWidth: 100, cursor: "pointer" }}>SGC</Typography>
                            <Typography onClick={() => navigate("/loged/about-us", { replace: true })} sx={{ cursor: "pointer", minWidth: 100 }}>
                                Sobre Nosotros
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Tooltip title="Configuración de cuenta">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={open ? "account-menu" : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? "true" : undefined}
                                    >
                                        <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar /> Perfil
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Avatar /> Mi cuenta
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <RequestPageIcon fontSize="small" />
                    </ListItemIcon>
                    Desprendible de nomina
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <FeedIcon fontSize="small" />
                    </ListItemIcon>
                    Certificación laboral
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Configuración
                </MenuItem>
                <MenuItem onClick={() => navigate("/", { replace: true })}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={anchorElMenu}
                id="account-menu"
                open={openMenu}
                onClose={handleCloseMenu}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar /> Home
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Avatar /> Sobre Nosotros
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <RequestPageIcon />
                    </ListItemIcon>
                    Formularios
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <FeedIcon />
                    </ListItemIcon>
                    Blog
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings />
                    </ListItemIcon>
                    SGC
                </MenuItem>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Tooltip title="Configuración de cuenta">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Menu>
        </>
    );
};

export default Navbar;
