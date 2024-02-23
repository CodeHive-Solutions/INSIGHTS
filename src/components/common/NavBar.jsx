import { React, useState, useEffect } from "react";
import { Box, Typography, MenuItem, Menu, Tooltip, IconButton, Avatar, Divider, ListItemIcon, Button, TextField, Popover, Dialog } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import FeedIcon from "@mui/icons-material/Feed";
import { useMediaQuery } from "@mui/material";
import { useNavigate, useMatch } from "react-router-dom";
import logotipo from "../../images/cyc-logos/logo-navbar.webp";
import SnackbarAlert from "./SnackBarAlert";
import FlagIcon from "@mui/icons-material/Flag";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Goals from "../shared/Goals";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { getApiUrl } from "../../assets/getApi";
import PolicyIcon from "@mui/icons-material/Policy";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentsIcon from "@mui/icons-material/Payments";
import { ListItemText } from "@mui/material";
const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElUtils, setAnchorElUtils] = useState(null);
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const openMenu = Boolean(anchorElMenu);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const openUtils = Boolean(anchorElUtils);
    const [openDialog, setOpenDialog] = useState(false);
    const cedula = JSON.parse(localStorage.getItem("cedula"));
    const [profilePicture, setProfilePicture] = useState();
    const cargoItem = localStorage.getItem("cargo");
    const isAdvisor = cargoItem && JSON.parse(cargoItem).includes("ASESOR");
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const goalsStatsPermission = cedula === "1020780559" || cedula === "28172713" || cedula === "1001185389";
    const servicesPermission =
        permissions &&
        (permissions.includes("users.upload_robinson_list") ||
            goalsStatsPermission ||
            permissions.includes("excels_processing.call_transfer") ||
            permissions.includes("contracts.view_contract") ||
            permissions.includes("operational_risk.view_events") ||
            permissions.includes("vacancy.view_reference"));
    const refreshToken = async (refreshTimer) => {
        try {
            const response = await fetch(`${getApiUrl()}token/refresh/`, {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                if (refreshTimer) {
                    localStorage.removeItem("refresh-timer-ls");
                }
                navigate("/", { replace: true });
                throw new Error(data.detail);
            } else if (response.status === 200) {
                if (refreshTimer === null) {
                    localStorage.setItem(
                        "refresh-timer-ls",
                        JSON.stringify({
                            expiry: new Date().getTime() + 15 * 60 * 60 * 1000, // 24 hours from now
                        })
                    );
                } else {
                    let refreshTimer = JSON.parse(localStorage.getItem("refresh-timer-ls"));
                    refreshTimer.expiry = new Date().getTime() + 15 * 60 * 60 * 1000; // 15 hours from now

                    // Store the item again
                    localStorage.setItem("refresh-timer-ls", JSON.stringify(refreshTimer));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let refreshTimer = JSON.parse(localStorage.getItem("refresh-timer-ls"));
        // Check if the item has expired
        if (refreshTimer === null || refreshTimer.expiry < new Date().getTime()) {
            refreshToken(refreshTimer);
        }
    }, []);

    const handleOpenDialog = () => setOpenDialog(true);

    const handleUtilitariosMenuOpen = (event) => {
        setAnchorElUtils(event.currentTarget);
    };

    const handleUtilitariosMenuClose = () => {
        setAnchorElUtils(null);
    };

    function CustomNavLink({ to, children, onMouseEnter, anchor }) {
        let match = useMatch(to);
        return (
            <Typography
                onClick={() => navigate(to)}
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

    const handleCloseSnack = () => setOpenSnack(false);
    const handleOpenSnack = () => setOpenSnack(true);

    const handleClickMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const handleCloseUtils = () => {
        setAnchorElUtils(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickUtils = (event) => {
        setAnchorElUtils(event.currentTarget);
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

    const handleLogout = async () => {
        try {
            const response = await fetch(`${getApiUrl()}token/destroy/`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                localStorage.removeItem("refresh-timer-ls");
                navigate("/", { replace: true });
            }

            if (response.status === 200) {
                localStorage.removeItem("refresh-timer-ls");
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.error(error);
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
                    zIndex: 1001,
                }}
                onMouseEnter={handleCloseUtils}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        // padding: "1rem 2rem",
                        backgroundColor: "rgba(255,255,255, 0.9)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <img alt="logo-cyc-navbar" style={{ cursor: "pointer" }} width={110} src={logotipo} onClick={() => navigate("/logged/home")} />
                    {/* {isMobile ? (
                        <IconButton onClick={handleClickMenu} size="small">
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <> */}
                    <CustomNavLink to="/logged/about-us">Sobre Nosotros</CustomNavLink>
                    <CustomNavLink to="/logged/blog">Blog</CustomNavLink>
                    <CustomNavLink to="/logged/sgc">Gestión Documental</CustomNavLink>
                    <CustomNavLink to="/logged/vacancies">Vacantes</CustomNavLink>
                    {servicesPermission ? (
                        <Typography
                            onMouseEnter={handleUtilitariosMenuOpen}
                            anchorel={anchorElUtils}
                            sx={{
                                minWidth: 100,
                                textAlign: "center",
                                cursor: "pointer",
                                borderBottom: "2px solid transparent", // Add a transparent bottom border
                                transition: "all 0.3s ease",
                                padding: "1.5rem 0", // Adjust padding to keep text aligned with the container
                                borderBottomColor: "transparent",
                            }}
                        >
                            Servicios
                        </Typography>
                    ) : null}
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Tooltip title="Mi Cuenta">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? "account-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {/* </>
                    )} */}
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
                {isAdvisor ? (
                    <MenuItem onClick={handleOpenDialog}>
                        <ListItemIcon>
                            <FlagIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Mis Metas" />
                    </MenuItem>
                ) : null}
                {/* <MenuItem onClick={() => navigate("/logged/my-payslips")}>
                    <ListItemIcon>
                        <ReceiptIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Mis desprendibles de nomina" />
                </MenuItem> */}
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar sesión" />
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
                    <ListItemText primary="Formularios" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <FeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Blog" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings />
                    </ListItemIcon>
                    <ListItemText primary="Gestión Documental" />
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
            <Menu
                anchorEl={anchorElUtils}
                open={openUtils}
                onClose={handleCloseUtils}
                id="account-menu-utils"
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
                <Box onMouseLeave={handleCloseUtils}>
                    {/* {permissions && permissions.includes()} */}
                    {goalsStatsPermission ? (
                        <MenuItem onClick={() => navigate("/logged/goals-stats")}>
                            <ListItemIcon>
                                <FlagIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Análisis de Metas" />
                        </MenuItem>
                    ) : null}
                    {permissions && permissions.includes("users.upload_robinson_list") ? (
                        <MenuItem onClick={() => navigate("/logged/upload-files")}>
                            <ListItemIcon>
                                <UploadFileIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Cargue de Archivos" />
                        </MenuItem>
                    ) : null}
                    {permissions && permissions.includes("excels_processing.call_transfer") ? (
                        <MenuItem onClick={() => navigate("/logged/quality")}>
                            <ListItemIcon>
                                <DriveFileMoveIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Trasladar Archivos" />
                        </MenuItem>
                    ) : null}
                    {permissions && permissions.includes("contracts.view_contract") ? (
                        <MenuItem onClick={() => navigate("/logged/legal")}>
                            <ListItemIcon>
                                <PolicyIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Contratos y Pólizas Legales" />
                        </MenuItem>
                    ) : null}
                    {permissions && permissions.includes("vacancy.view_reference") ? (
                        <MenuItem onClick={() => navigate("/logged/vacancies-referred")}>
                            <ListItemIcon>
                                <ForwardToInboxIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Vacantes Referidas" />
                        </MenuItem>
                    ) : null}
                    {permissions && permissions.includes("operational_risk.view_events") ? (
                        <MenuItem onClick={() => navigate("/logged/risk-events")}>
                            <ListItemIcon>
                                <FmdBadIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Eventos de Riesgo Operativo" />
                        </MenuItem>
                    ) : null}
                    {permissions && permissions.includes("pay_slips.view_pay_slips") ? (
                        <MenuItem onClick={() => navigate("/logged/payslips")}>
                            <ListItemIcon>
                                <PaymentsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary=" Registros de desprendibles de nomina" />
                        </MenuItem>
                    ) : null}
                </Box>
            </Menu>
            {isAdvisor ? <Goals openDialog={openDialog} setOpenDialog={setOpenDialog} showSnack={showSnack} /> : null}
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Navbar;
