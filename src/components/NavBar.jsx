import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const NavBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSubMenuOpen = (event) => {
        setSubMenuAnchorEl(event.currentTarget);
    };

    const handleSubMenuClose = () => {
        setSubMenuAnchorEl(null);
    };

    return (
        <Box
            position="fixed"
            sx={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "white",
                width: "100%",
                top: 0,
                zIndex: 2,
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    maxWidth: "100px",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    INSIGHTS
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500 }}
                    onMouseEnter={handleSubMenuOpen}
                    onMouseLeave={handleSubMenuClose}
                >
                    Formularios
                    <Menu
                        anchorEl={subMenuAnchorEl}
                        open={Boolean(subMenuAnchorEl)}
                        onClose={handleSubMenuClose}
                        MenuListProps={{ onMouseLeave: handleSubMenuClose }}
                        elevation={0}
                    >
                        <MenuItem onClick={handleSubMenuClose}>
                            Formulario 1
                        </MenuItem>
                        <MenuItem onClick={handleSubMenuClose}>
                            Formulario 2
                        </MenuItem>
                        <MenuItem onClick={handleSubMenuClose}>
                            Formulario 3
                        </MenuItem>
                    </Menu>
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Blog
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    SGC
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Sobre Nosotros
                </Typography>
                <IconButton
                    color="inherit"
                    aria-label="account"
                    onClick={handleMenuOpen}
                >
                    <AccountCircleOutlinedIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </Box>
    );
};

export default NavBar;
