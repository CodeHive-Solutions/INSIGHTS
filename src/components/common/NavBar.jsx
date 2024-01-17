import { React, useState, useEffect } from "react";
import { Box, Typography, MenuItem, Menu, Tooltip, IconButton, Avatar, Divider, ListItemIcon, Button, TextField, Popover, Dialog } from "@mui/material";
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
import logotipo from "../../images/cyc-logos/logo-navbar.webp";
import SnackbarAlert from "./SnackBarAlert";
import FlagIcon from "@mui/icons-material/Flag";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Goals from "../shared/Goals";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { getApiUrl } from "../../assets/getApi";
import PolicyIcon from "@mui/icons-material/Policy";
import Sidebar from "../common/Sidebar";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElUtils, setAnchorElUtils] = useState(null);
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const openMenu = Boolean(anchorElMenu);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const openUtils = Boolean(anchorElUtils);
    const [openDialog, setOpenDialog] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = (openServices) => {
        setSidebarOpen(openServices);
    };

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

    const getGoal = async () => {
        try {
            const response = await fetch(`${getApiUrl()}goals/15225716/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            if (response.status === 200) {
                setGoalCedula(data.cedula);
                if (data.accepted) {
                    setGoalAccepted(true);
                } else if (data.declined) {
                    setGoalDeclined(true);
                } else if (data.additional_info.length > 0) {
                    setGoalAdvisorClaro(data.additional_info);
                } else if (data.quantity_goal && data.criteria_goal) {
                    setGoalQuantity(data.quantity_goal);
                    setGoalCriteria(data.criteria_goal);
                }
                if (data.executionAccepted) {
                    setExecutionAcceptedGoal(true);
                } else if (data.executionDeclined) {
                    setExecutionDeclinedGoal(true);
                } else if (data.total) {
                    setExecutionTotalGoal(true);
                    setResult(data.result);
                    setEvaluation(data.evaluation);
                    setQuality(data.quality);
                    setCleanDesk(data.clean_desk);
                    setTotal(data.total);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                    <img style={{ cursor: "pointer" }} width={110} src={logotipo} alt="" onClick={() => navigate("/logged/home")} />
                    {/* {isMobile ? (
                        <IconButton onClick={handleClickMenu} size="small">
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <> */}
                    <CustomNavLink to="/logged/about-us">Sobre Nosotros</CustomNavLink>
                    <CustomNavLink to="/logged/blog">Blog</CustomNavLink>
                    <CustomNavLink to="/logged/sgc">Gestión Documental</CustomNavLink>
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
                {/* <MenuItem onClick={handleClose}>
                    <Avatar /> Perfil
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Avatar /> Mi cuenta
                </MenuItem> */}
                <MenuItem onClick={handleOpenDialog}>
                    <ListItemIcon>
                        <FlagIcon fontSize="small" />
                    </ListItemIcon>
                    Mi Meta
                </MenuItem>
                <Divider />
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
                    Gestión Documental
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
                    <MenuItem onClick={() => navigate("/logged/goals-stats")}>
                        <ListItemIcon>
                            <FlagIcon fontSize="small" />
                        </ListItemIcon>
                        Análisis de Metas
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/logged/upload-files")}>
                        <ListItemIcon>
                            <UploadFileIcon fontSize="small" />
                        </ListItemIcon>
                        Cargue de Archivos
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/logged/quality")}>
                        <ListItemIcon>
                            <DriveFileMoveIcon fontSize="small" />
                        </ListItemIcon>
                        Trasladar Archivos
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/logged/legal")}>
                        <ListItemIcon>
                            <PolicyIcon fontSize="small" />
                        </ListItemIcon>
                        Contratos y Pólizas Legales
                    </MenuItem>
                </Box>
            </Menu>
            <Goals openDialog={openDialog} setOpenDialog={setOpenDialog} />
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Navbar;
