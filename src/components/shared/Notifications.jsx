import React, { useState } from "react";

// Custom Components
import { getApiUrl } from "../../assets/getApi";
import SnackbarAlert from "../common/SnackBarAlert";
import { handleError } from "../../assets/handleError";

// Material UI
import { MenuItem, Menu, Box, Typography, ListItemIcon, ListItemText, Avatar, ListItemAvatar, List, ListItem, IconButton } from "@mui/material";

// Icons
import { MoreHoriz } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

const Notifications = ({ anchorNotification, openNotification, setAnchorNotification, notifications, getNotifications }) => {
    const [anchorElOptions, setAnchorElOptions] = useState(null);
    const openOptions = Boolean(anchorElOptions);
    const [notificationStatus, setNotificationStatus] = useState(false);
    const [notificationId, setNotificationId] = useState(null);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");

    const handleClose = () => {
        setAnchorNotification(null);
    };

    const showSnack = (severity, message) => {
        setMessage(message);
        setSeverity(severity);
        setOpenSnack(true);
    };

    const closeSnack = () => {
        setOpenSnack(false);
    };

    const handleCloseOptions = () => {
        setAnchorElOptions(null);
    };

    const handleClickOptions = (event, id, notificationStatusOptions) => {
        setNotificationId(id);
        setAnchorElOptions(event.currentTarget);
        setNotificationStatus(notificationStatusOptions);
    };

    const handleMarkAs = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}notifications/${notificationId}/`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: !notificationStatus,
                }),
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                setNotificationStatus(!notificationStatus);
                setAnchorElOptions(null);
                getNotifications();
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    const handleDeleteNotification = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}notifications/${notificationId}/`, {
                method: "DELETE",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 204) {
                setAnchorElOptions(null);
                showSnack("success", "Notificación eliminada");
                getNotifications();
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        }
    };

    return (
        <Box>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={closeSnack} />
            <Menu
                id="notifications-menu"
                anchorEl={anchorNotification}
                open={openNotification}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
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
            >
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <List
                            key={notification.id}
                            sx={{
                                backgroundColor: notification.read ? "#f5fafc" : "#e3f5fd",
                                width: "100%",
                                maxWidth: 400,
                            }}
                        >
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: "orange" }} alt="Notification Icon">
                                        <BeachAccessIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={notification.title}
                                    secondary={
                                        <Typography sx={{ display: "inline" }} variant="body2" color="gray">
                                            {notification.message}
                                        </Typography>
                                    }
                                />
                                <IconButton onClick={(event) => handleClickOptions(event, notification.id, notification.read)}>
                                    <MoreHoriz />
                                </IconButton>
                            </ListItem>
                        </List>
                    ))
                ) : (
                    <List
                        sx={{
                            width: 400,
                        }}
                    >
                        <ListItem>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    gap: "1rem",
                                    p: "2rem",
                                }}
                            >
                                <NotificationsNoneIcon sx={{ color: "gray", fontSize: "42px" }} />
                                <ListItemText sx={{ color: "gray" }} primary="No tienes notificaciones" />
                            </Box>
                        </ListItem>
                    </List>
                )}
            </Menu>

            {/* options menu */}
            <Menu
                id="options-menu"
                anchorEl={anchorElOptions}
                open={openOptions}
                onClose={handleCloseOptions}
                onClick={handleCloseOptions}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem dense onClick={handleMarkAs}>
                    <ListItemIcon>{notificationStatus ? <NotificationsActiveIcon fontSize="small" /> : <NotificationsNoneIcon fontSize="small" />}</ListItemIcon>
                    <ListItemText>
                        {notificationStatus ? <Typography variant="body2">Marcar como no leído</Typography> : <Typography variant="body2">Marcar como leído</Typography>}
                    </ListItemText>
                </MenuItem>
                <MenuItem dense onClick={handleDeleteNotification}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Eliminar notificación" />
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Notifications;
