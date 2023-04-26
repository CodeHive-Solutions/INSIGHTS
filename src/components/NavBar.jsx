import React, { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const NavBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            position="fixed"
            sx={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "white",
                width: "100%",
                zIndex: 2,
            }}
        >
            <Toolbar
                sx={{
                    width: "100%",
                    display: "flex",
                    gap: "190px",
                    margin: "0.5em",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    INSIGHTS
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500, cursor: "pointer" }}
                    onClick={handleClick}
                >
                    Products
                </Typography>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Product 1</MenuItem>
                    <MenuItem onClick={handleClose}>Product 2</MenuItem>
                    <MenuItem onClick={handleClose}>Product 3</MenuItem>
                </Menu>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Blog
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    SGC
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Sobre Nosotros
                </Typography>
                <IconButton color="inherit" aria-label="account">
                    <AccountCircleOutlinedIcon />
                </IconButton>
            </Toolbar>
        </Box>
    );
};

export default NavBar;
