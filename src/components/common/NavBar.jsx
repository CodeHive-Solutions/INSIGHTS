import { useState, useEffect } from "react";

// Libraries
import { useNavigate, useMatch } from "react-router-dom";

// Custom Components
import Goals from "../shared/Goals";
import SnackbarAlert from "./SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";

// Material-UI
import { Box, Button, Typography, MenuItem, Menu, Tooltip, IconButton, Avatar, ListItemIcon, useMediaQuery, ListItemText, LinearProgress, Fade } from "@mui/material";

// Icons
import { Logout, Settings } from "@mui/icons-material";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import FeedIcon from "@mui/icons-material/Feed";
import FlagIcon from "@mui/icons-material/Flag";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import PolicyIcon from "@mui/icons-material/Policy";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentsIcon from "@mui/icons-material/Payments";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DescriptionIcon from "@mui/icons-material/Description";
import TopicIcon from "@mui/icons-material/Topic";

// Media
import logotipo from "../../images/cyc-logos/logo-navbar.webp";

const Navbar = () => {
    const [openCollapse, setOpenCollapse] = useState(false);
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
    const goalsStatsPermission = cedula === "1020780559" || cedula === "28172713" || cedula === "1001185389" || cedula === "25878771";
    const servicesPermission =
        permissions &&
        (permissions.includes("users.upload_robinson_list") ||
            goalsStatsPermission ||
            permissions.includes("excels_processing.call_transfer") ||
            permissions.includes("contracts.view_contract") ||
            permissions.includes("operational_risk.view_events") ||
            permissions.includes("vacancy.view_reference") ||
            permissions.includes("payslip.add_payslip") ||
            permissions.includes("employment_management.view_employmentcertification"));

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
            <Button
                onClick={() => navigate(to)}
                sx={{
                    minWidth: 100,
                    textAlign: "center",
                    cursor: "pointer",
                    borderBottom: "2px solid transparent", // Add a transparent bottom border
                    transition: "all 0.3s ease",
                    padding: "1.5rem 1rem    ", // Adjust padding to keep text aligned with the container
                    borderBottomColor: match ? "#0076A8" : "transparent",
                    color: match ? "#0076A8" : "inherit",
                    "&:hover": {
                        color: "#0076A8",
                        borderBottomColor: "#0076A8", // Change the background color on hover
                    },
                }}
            >
                {children}
            </Button>
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

    const sendCertification = async () => {
        setOpenCollapse(true);

        try {
            const response = await fetch(`${getApiUrl()}employment-management/send-employment-certification/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cedula }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 500) {
                    showSnack("error", "Error en el servidor, por favor intente más tarde", true);
                    throw new Error(data.detail);
                }
                showSnack("error", "Error en el servidor, por favor intente más tarde", true);
            } else if (response.status === 200) {
                showSnack("success", data.message + " correctamente al correo " + data.email.toLowerCase());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setOpenCollapse(false);
        }
    };

    const isMobile = useMediaQuery("(max-width: 600px)");

    return (
        <>
            <Fade in={openCollapse}>
                <LinearProgress sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1002 }} variant="query" />
            </Fade>
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
                    <Button sx={{ borderRadius: "100px" }}>
                        <img alt="logo-cyc-navbar" style={{ cursor: "pointer" }} width={110} src={logotipo} onClick={() => navigate("/logged/home")} />
                    </Button>
                    <CustomNavLink to="/logged/about-us">Sobre Nosotros</CustomNavLink>
                    <CustomNavLink to="/logged/blog">Blog</CustomNavLink>
                    <CustomNavLink to="/logged/sgc">Gestión Documental</CustomNavLink>
                    <CustomNavLink to="/logged/vacancies">Vacantes</CustomNavLink>
                    {servicesPermission ? (
                        <Button
                            id="button-utils"
                            endIcon={anchorElUtils ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            onClick={handleUtilitariosMenuOpen}
                            anchorel={anchorElUtils}
                            aria-controls={openUtils ? "account-menu-utils" : undefined}
                            aria-haspopup="true"
                            aria-expanded={openUtils ? "true" : undefined}
                            sx={{
                                minWidth: 100,
                                textAlign: "center",
                                cursor: "pointer",
                                borderBottom: "2px solid transparent", // Add a transparent bottom border
                                transition: "all 0.3s ease",
                                padding: "1.5rem 1rem", // Adjust padding to keep text aligned with the container
                                borderBottomColor: "transparent",
                                color: "inherit",
                                "&:hover": {
                                    color: "#0076A8",
                                    borderBottomColor: "#0076A8", // Change the background color on hover
                                },
                            }}
                        >
                            Servicios
                        </Button>
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
                <MenuItem onClick={() => navigate("/logged/my-payslips")}>
                    <ListItemIcon>
                        <ReceiptIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Mis desprendibles de nomina" />
                </MenuItem>
                {/* <MenuItem onClick={() => sendCertification()}>
                    <ListItemIcon>
                        <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Certificación Laboral" />
                </MenuItem> */}
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar sesión" />
                </MenuItem>
            </Menu>
            <Menu
                anchorEl={anchorElUtils}
                open={openUtils}
                onClick={handleCloseUtils}
                onClose={handleCloseUtils}
                id="account-menu-utils"
                MenuListProps={{
                    "aria-labelledby": "button-utils",
                }}
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
                {permissions && permissions.includes("payslip.add_payslip") ? (
                    <MenuItem onClick={() => navigate("/logged/payslips")}>
                        <ListItemIcon>
                            <PaymentsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Registros de Desprendibles de Nomina" />
                    </MenuItem>
                ) : null}
                {/* {permissions && permissions.includes("employment_management.view_employmentcertification") ? (
                    <MenuItem onClick={() => navigate("/logged/certifications")}>
                        <ListItemIcon>
                            <TopicIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Certificados Laborales" />
                    </MenuItem>
                ) : null} */}
            </Menu>
            {isAdvisor ? <Goals openDialog={openDialog} setOpenDialog={setOpenDialog} showSnack={showSnack} /> : null}
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Navbar;
