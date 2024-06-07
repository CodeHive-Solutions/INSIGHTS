import React, { useState } from "react";

// Custom Components
import { getApiUrl } from "../../assets/getApi";
import SnackbarAlert from "../common/SnackBarAlert";

// Material UI
import { MenuItem, Menu, Box, Typography, ListItemIcon, ListItemText, Avatar, ListItemAvatar, List, ListItem, Divider, Button, IconButton } from "@mui/material";

// Icons
import FlagIcon from "@mui/icons-material/Flag";
import { color } from "framer-motion";
import ClearIcon from "@mui/icons-material/Clear";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { MoreHoriz } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

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

    const showSnack = (message, severity) => {
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
            const response = await fetch(`${getApiUrl()}/notifications/${notificationId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: !notificationStatus,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            } else if (response.status === 200) {
                setNotificationStatus(!notificationStatus);
                setAnchorElOptions(null);
                getNotifications();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteNotification = async () => {
        try {
            const response = await fetch(`${getApiUrl()}/notifications/${notificationId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            } else if (response.status === 200) {
                setAnchorElOptions(null);
                showSnack("Notificación eliminada", "success");
                getNotifications();
            }
        } catch (error) {
            console.error(error);
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
                        overflow: "visible",
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
                {/* example hardcoded notifications */}
                <List
                    sx={{
                        backgroundColor: "#e3f5fd",
                        width: "100%",

                        maxWidth: 400,
                        "&:hover": {
                            backgroundColor: "#e3f5fd",
                            cursor: "pointer",
                        },
                    }}
                >
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary="Lorem ipsum dolor sit amet consectetur, adipisicing elit."
                            secondary={
                                <Typography sx={{ display: "inline" }} variant="body2" color="gray">
                                    <span style={{ color: "#131313" }}>Ali Connors</span> — Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor similique
                                    soluta ipsa architecto voluptatibus nemo consectetur quas, hic odio voluptatem sunt possimus delectus quaerat id, voluptate culpa nam
                                    natus impedit."
                                </Typography>
                            }
                        />
                        <IconButton onClick={(event) => handleClickOptions(event, true)}>
                            <MoreHoriz />
                        </IconButton>
                    </ListItem>
                </List>
                <List
                    sx={{
                        backgroundColor: "#f5fafc",
                        width: "100%",

                        maxWidth: 400,
                        "&:hover": {
                            backgroundColor: "#f5f5f5",
                            cursor: "pointer",
                        },
                    }}
                >
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary="Lorem ipsum dolor sit amet consectetur, adipisicing elit."
                            secondary={
                                <Typography sx={{ display: "inline" }} variant="body2" color="gray">
                                    <span style={{ color: "#131313" }}>Ali Connors</span> — Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor similique
                                    soluta ipsa architecto voluptatibus nemo consectetur quas, hic odio voluptatem sunt possimus delectus quaerat id, voluptate culpa nam
                                    natus impedit."
                                </Typography>
                            }
                        />
                        <IconButton onClick={(event) => handleClickOptions(event, true)}>
                            <MoreHoriz />
                        </IconButton>
                    </ListItem>
                </List>
                <Divider variant="inset" component="li" />

                {notifications?.length > 0 ? (
                    notifications.map((notification) => (
                        <List
                            sx={{
                                backgroundColor: notificationStatus ? "#e3f5fd" : "#f5fafc",
                                width: "100%",

                                maxWidth: 400,
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                    cursor: "pointer",
                                },
                            }}
                        >
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={notification.title}
                                    secondary={
                                        <Typography sx={{ display: "inline" }} variant="body2" color="gray">
                                            <span style={{ color: "#131313" }}>{notification.user}</span> — {notification.message}
                                        </Typography>
                                    }
                                />
                                <IconButton onClick={(event) => handleClickOptions(event, notification.id, true)}>
                                    <MoreHoriz />
                                </IconButton>
                            </ListItem>
                        </List>
                    ))
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: "2rem" }}>
                        <Typography color="text.secondary" sx={{ p: "1rem" }}>
                            No tienes notificaciones
                        </Typography>
                        <NotificationsNoneIcon sx={{ fontSize: 50 }} fontSize="large" color="disabled" />
                    </Box>
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
