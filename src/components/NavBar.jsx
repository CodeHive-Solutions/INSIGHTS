import { React, useState, useEffect, useRef } from "react";
import { Box, Typography, MenuItem, Menu, Tooltip, IconButton, Avatar, Divider, ListItemIcon, Button, TextField } from "@mui/material";
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
import { useNavigate, useMatch } from "react-router-dom";
import logotipo from "../images/logotipo-navbar-copia.webp";
import SnackbarAlert from "../components/SnackBarAlert";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const openMenu = Boolean(anchorElMenu);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);

    function CustomNavLink({ to, children }) {
        let match = useMatch(to);
        return (
            <Typography
                onClick={() => navigate(to, { replace: true })}
                sx={{
                    minWidth: 100,
                    textAlign: "center",
                    cursor: "pointer",
                    borderBottom: "2px solid transparent", // Add a transparent bottom border
                    transition: "all 0.3s ease",
                    padding: "1.5rem 0", // Adjust padding to keep text aligned with the container
                    borderBottomColor: match ? "#0076A8" : "transparent",
                    color: match ? "#0076A8" : "inherit",
                    "&:hover": {
                        color: "#0076A8",
                        borderBottomColor: "#0076A8", // Change the background color on hover
                    },
                }}
            >
                {children}
            </Typography>
        );
    }

    const linkStyle = {
        minWidth: 100,
        textDecoration: "none",
        color: "#131313",
        textAlign: "center",
        cursor: "pointer",
        borderBottom: "2px solid transparent", // Add a transparent bottom border
        transition: "all 0.3s ease",
        padding: "1.5rem 0", // Adjust padding to keep text aligned with the container
        "&:hover": {
            color: "#0076A8",
            borderBottomColor: "#0076A8", // Change the background color on hover
        },
    };

    const activeLinkStyle = {
        ...linkStyle,
        borderBottomColor: "#0076A8",
        color: "#0076A8", // Change the background color on hover
    };

    const handleCloseSnack = () => setOpenSnack(false);
    const handleOpenSnack = () => setOpenSnack(true);

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

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await fetch("https://insights-api-dev.cyc-bpo.com/token/refresh/", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail);
            }

            const data = await response.json();
            if (response.status === 200) {
                console.log("refresh token success");
            } else if (response.status === 401 && data.detail === "Authentication credentials were not provided") {
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("https://insights-api-dev.cyc-bpo.com/token/destroy/", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 401 && data.detail === "Authentication credentials were not provided.") {
                    refreshToken();
                }
                throw new Error(data.detail);
            }

            const data = await response.json();
            if (response.status === 200) {
                refreshToken();
                console.log("logout success");
                navigate("/", { replace: true });
            } else if (response.status === 401 && data.detail === "Authentication credentials were not provided") {
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    const isMobile = useMediaQuery("(max-width: 600px)");

    return (
        <>
            <Box
                className="navbar"
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    backdropFilter: "blur(10px)",
                    zIndex: 50,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        backgroundColor: "rgba(255,255,255, 0.9)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <img style={{ cursor: "pointer" }} width={110} src={logotipo} alt="" onClick={() => navigate("/logged/home")} />
                    {isMobile ? (
                        <IconButton onClick={handleClickMenu} size="small">
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <>
                            <CustomNavLink to="/logged/sgc">SGC</CustomNavLink>
                            <CustomNavLink to="/logged/blog">Blog</CustomNavLink>
                            <CustomNavLink to="/logged/about-us">Sobre Nosotros</CustomNavLink>
                            <CustomNavLink to="/logged/utilitarios">Utilitarios</CustomNavLink>
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
                <MenuItem onClick={handleLogout}>
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
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Navbar;
