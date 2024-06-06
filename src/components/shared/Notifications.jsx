import React, { useState } from "react";

// Custom Components
import { getApiUrl } from "../../assets/getApi";

// Material UI
import { MenuItem, Menu, Box, Typography, ListItemIcon, ListItemText, Avatar, ListItemAvatar, List, ListItem, Divider, Button, IconButton } from "@mui/material";

// Icons
import FlagIcon from "@mui/icons-material/Flag";
import { color } from "framer-motion";
import ClearIcon from "@mui/icons-material/Clear";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const Notifications = ({ anchorNotification, openNotification, setAnchorNotification, notifications }) => {
    const handleClose = () => {
        setAnchorNotification(null);
    };

    return (
        <Box>
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
                {/* <List
                    sx={{
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
                    </ListItem>
                    <Box sx={{ width: "100%", justifyContent: "space-between", display: "flex", px: "5rem" }}>
                        <IconButton>
                            <ClearIcon />
                        </IconButton>
                        <IconButton>
                            <MarkChatReadIcon />
                        </IconButton>
                    </Box>
                </List>
                <Divider variant="inset" component="li" /> */}

                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <List
                            sx={{
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
                                        <React.Fragment>
                                            <Typography sx={{ display: "inline" }} variant="body2" color="text.primary">
                                                {notification.sender}
                                            </Typography>
                                            {` ${notification.message}`}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Box sx={{ width: "100%", justifyContent: "space-between", display: "flex", px: "5rem" }}>
                                <IconButton>
                                    <ClearIcon />
                                </IconButton>
                                <IconButton>
                                    <MarkChatReadIcon />
                                </IconButton>
                            </Box>
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
        </Box>
    );
};

export default Notifications;
