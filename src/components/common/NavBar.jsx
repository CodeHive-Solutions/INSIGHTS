import { useState, useEffect, useRef } from "react";

// Libraries
import { useNavigate, useMatch } from "react-router-dom";

// Custom Components
import Goals from "../shared/Goals";
import SnackbarAlert from "./SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import MyAccountDialog from "../shared/MyAccount";
import InactivityDetector from "../shared/InactivityDetector";
import VacationsRequest from "../shared/VacationsRequest";
import Notifications from "../shared/Notifications";
import { handleError } from "../../assets/handleError";

// Material-UI
import {
    Box,
    Button,
    Typography,
    MenuItem,
    Menu,
    Tooltip,
    IconButton,
    Avatar,
    ListItemIcon,
    useMediaQuery,
    ListItemText,
    LinearProgress,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Collapse,
    TextField,
    Divider,
    Badge,
} from "@mui/material";

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
import LuggageIcon from "@mui/icons-material/Luggage";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Media
import logotipo from "../../images/cyc-logos/logo-navbar.webp";

const Navbar = () => {
    const [openCollapse, setOpenCollapse] = useState(false);
    const [openCollapseEmail, setOpenCollapseEmail] = useState(false);
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
    const [openAccountDialog, setOpenAccountDialog] = useState(false);
    const cedula = JSON.parse(localStorage.getItem("cedula"));
    const [openCertification, setOpenCertification] = useState(false);
    const [openCollapseBonuses, setOpenCollapseBonuses] = useState(false);
    const [checked, setChecked] = useState(false);
    const emailRef = useRef(null);
    const cargoItem = localStorage.getItem("cargo");
    const isAdvisor = cargoItem && JSON.parse(cargoItem).includes("ASESOR");
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const currentEmail = JSON.parse(localStorage.getItem("email"));
    const bonusesInput = useRef(null);
    const [openVacation, setOpenVacation] = useState(false);
    const [anchorNotification, setAnchorNotification] = useState(null);
    const openNotification = Boolean(anchorNotification);
    const [notifications, setNotifications] = useState([]);

    const servicesPermission =
        permissions &&
        (permissions.includes("users.upload_robinson_list") ||
            permissions.includes("goals.view_goals") ||
            permissions.includes("excels_processing.call_transfer") ||
            permissions.includes("contracts.view_contract") ||
            permissions.includes("operational_risk.view_events") ||
            permissions.includes("vacancy.view_reference") ||
            permissions.includes("payslip.add_payslip") ||
            permissions.includes("employment_management.view_employmentcertification") ||
            permissions.includes("goals.add_goals"));

    const refreshToken = async (refreshTimer) => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}token/refresh/`, {
                method: "POST",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
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
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
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

    const getNotifications = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}notifications/`, {
                method: "GET",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getNotifications();
    }, []);

    const handleCloseSnack = () => setOpenSnack(false);

    const handleOpenCertification = () => setOpenCertification(true);

    const handleCloseCertification = () => {
        setOpenCertification(false);
        setOpenCollapseBonuses(false);
        setChecked(false);
        setOpenCollapseEmail(false);
    };

    const handleOpenCollapseBonuses = () => setOpenCollapseBonuses(!openCollapseBonuses);
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

    const handleOpenNotification = (event) => {
        setAnchorNotification(event.currentTarget);
    };

    const handleClickUtils = (event) => {
        setAnchorElUtils(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenAccountDialog = () => {
        setOpenAccountDialog(true);
    };

    const handleCloseAccountDialog = () => {
        setOpenAccountDialog(false);
    };

    const handleOpenCollapseEmail = () => {
        setOpenCollapseEmail(!openCollapseEmail);
        emailRef.current.value = "";
    };

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleLogout = async (inactivity) => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}token/destroy/`, {
                method: "POST",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                localStorage.removeItem("refresh-timer-ls");
                if (inactivity === true) {
                    // Pass a parameter to the login component to show an alert
                    const currentUrl = window.location.href;
                    navigate("/", { state: { showAlert: true, lastLocation: currentUrl } });
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    const sendCertification = async () => {
        setOpenCollapse(true);
        let body = {};

        if (checked) {
            body = {
                months: bonusesInput.current.value,
                email: emailRef.current.value,
            };
        } else {
            body = {
                email: emailRef.current.value,
            };
        }

        try {
            const response = await fetch(`${getApiUrl().apiUrl}employment-management/send-employment-certification/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setOpenCertification(false);
                showSnack("success", data.message + " correctamente al correo " + data.email.toLowerCase());
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        } finally {
            setOpenCollapse(false);
        }
    };

    const handleChangeCheck = (event) => {
        setChecked(event.target.checked);
        handleOpenCollapseBonuses();
    };

    const handleOpenVacation = () => {
        setOpenVacation(true);
    };

    const isMobile = useMediaQuery("(max-width: 600px)");

    return (
        <>
            <InactivityDetector handleLogout={handleLogout} />
            <VacationsRequest openVacation={openVacation} setOpenVacation={setOpenVacation} />
            <Notifications
                notifications={notifications}
                setAnchorNotification={setAnchorNotification}
                anchorNotification={anchorNotification}
                openNotification={openNotification}
                getNotifications={getNotifications}
            />
            <Dialog open={openCertification} onClose={handleCloseCertification} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿Enviar Certificación Laboral?"}</DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText id="alert-dialog-description">
                        Selecciona si deseas que la certificación se envíe a tu correo, ya sea con o sin bonificaciones, y especifica los meses promediados de estas, si
                        las hubiera.
                    </DialogContentText>
                    <FormGroup sx={{ mt: ".5rem" }}>
                        <FormControlLabel
                            control={<Checkbox checked={checked} onChange={handleChangeCheck} inputProps={{ "aria-label": "controlled" }} />}
                            label="Incluir bonificaciones"
                        />
                    </FormGroup>
                    <Collapse sx={{ py: "1rem" }} in={openCollapseBonuses}>
                        <TextField inputRef={bonusesInput} sx={{ width: "100%" }} defaultValue="3" label="Seleccione los meses promediados de bonificaciones" select>
                            <MenuItem value={3}>Últimos 3 meses</MenuItem>
                            <MenuItem value={6}>Últimos 6 meses</MenuItem>
                        </TextField>
                    </Collapse>
                    <Typography color="text.secondary">
                        La certificación laboral sera enviada al correo electrónico:{" "}
                        <span style={{ fontWeight: 500, color: "rgb(0,0,0,0.8)" }}>{currentEmail.toLowerCase()}</span>
                    </Typography>
                    <Collapse in={!openCollapseEmail}>
                        <Button variant="outlined" sx={{ mt: "1rem" }} onClick={handleOpenCollapseEmail}>
                            Ese no es mi correo
                        </Button>
                    </Collapse>
                    <Collapse in={openCollapseEmail}>
                        <TextField
                            sx={{ mt: "1rem" }}
                            inputRef={emailRef}
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Correo electrónico"
                            type="email"
                            name="email"
                            fullWidth
                            variant="standard"
                        />
                    </Collapse>
                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={handleCloseCertification}>Cancelar</Button>
                    <Button onClick={sendCertification}>Enviar</Button>
                </DialogActions>
            </Dialog>
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

                    {cedula === "1000065648" || cedula === "1001185389" ? <CustomNavLink to="/logged/pqrs">PQRS</CustomNavLink> : null}
                    {cedula === "19438555" || cedula === "1032495391" ? (
                        <CustomNavLink to="/logged/risk-events">Eventos de Riesgo</CustomNavLink>
                    ) : servicesPermission ? (
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
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
                        <Tooltip title="Mis Notificaciones">
                            <Badge badgeContent={notifications?.length || 0} color="primary" overlap="circular" variant="dot">
                                <IconButton
                                    onClick={handleOpenNotification}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={openNotification ? "notification-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openNotification ? "true" : undefined}
                                >
                                    <NotificationsIcon sx={{ width: 30, height: 30 }} />
                                </IconButton>
                            </Badge>
                        </Tooltip>
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
                {/* <MenuItem onClick={handleOpenAccountDialog}>
                    <ListItemIcon>
                        <Avatar />
                    </ListItemIcon>
                    <ListItemText primary="Mi Cuenta" />
                </MenuItem>
                <Divider /> */}
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
                <MenuItem onClick={handleOpenCertification}>
                    <ListItemIcon>
                        <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Certificación Laboral" />
                </MenuItem>
                <MenuItem onClick={handleOpenVacation}>
                    <ListItemIcon>
                        <LuggageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Solicitud de Vacaciones" />
                </MenuItem>
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
                {permissions && permissions.includes("goals.view_goals") ? (
                    <MenuItem onClick={() => navigate("/logged/goals-stats")}>
                        <ListItemIcon>
                            <FlagIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Análisis de Metas" />
                    </MenuItem>
                ) : null}
                {permissions && (permissions.includes("users.upload_robinson_list") || permissions.includes("goals.add_goals")) ? (
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
                {permissions && permissions.includes("employment_management.view_employmentcertification") ? (
                    <MenuItem onClick={() => navigate("/logged/certifications")}>
                        <ListItemIcon>
                            <TopicIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Certificados Laborales" />
                    </MenuItem>
                ) : null}
            </Menu>
            {isAdvisor ? <Goals openDialog={openDialog} setOpenDialog={setOpenDialog} showSnack={showSnack} /> : null}
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
            <MyAccountDialog open={openAccountDialog} onClose={handleCloseAccountDialog} />
        </>
    );
};

export default Navbar;
