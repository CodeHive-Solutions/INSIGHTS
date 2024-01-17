// Sidebar.js

import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import StarBorder from "@mui/icons-material/StarBorder";
import { ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlagIcon from "@mui/icons-material/Flag";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import PolicyIcon from "@mui/icons-material/Policy";
import { Divider } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import FolderIcon from "@mui/icons-material/Folder";
import HomeRepairServiceRoundedIcon from "@mui/icons-material/HomeRepairServiceRounded";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";

const Sidebar = ({ isOpen, toggleDrawer }) => {
    const [openServices, setOpenServices] = useState(false);
    const navigate = useNavigate();
    const handleOpenServices = () => setOpenServices(!openServices);

    return (
        <Drawer sx={{ backgroundColor: "rgba(255,255,255, 0.1)", backdropFilter: "blur(1px)" }} open={isOpen} onClose={() => toggleDrawer(false)}>
            <Box sx={{ display: "flex", justifyContent: "center", p: "1rem" }}>
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                    Menú
                </Typography>
            </Box>
            <Divider />
            <List sx={{ width: "350px" }} onClick={() => toggleDrawer(false)}>
                <ListItemButton onClick={() => navigate("/logged/about-us")}>
                    <ListItemIcon>
                        <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sobre Nosotros" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/logged/blog")}>
                    <ListItemIcon>
                        <NewspaperIcon />
                    </ListItemIcon>
                    <ListItemText primary="Blog" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/logged/sgc")}>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="Gestión Documental" />
                </ListItemButton>
            </List>
            <Divider />
            <List>
                <ListItemButton onClick={handleOpenServices}>
                    <ListItemIcon>
                        <HomeRepairServiceRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Servicios" />
                    {openServices ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openServices} timeout="auto" unmountOnExit>
                    <List onClick={() => toggleDrawer(false)} component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/logged/goals-stats")}>
                            <ListItemIcon>
                                <FlagIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Análisis de Metas" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/logged/upload-files")}>
                            <ListItemIcon>
                                <UploadFileIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Cargue de Archivos" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/logged/quality")}>
                            <ListItemIcon>
                                <DriveFileMoveIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Trasladar Archivos" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/logged/legal")}>
                            <ListItemIcon>
                                <PolicyIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Contratos y Pólizas Legales" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </Drawer>
    );
};

export default Sidebar;
