import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: "auto",
                py: 2,
                px: 3,
                backgroundColor: "#f8f9fa",
                textAlign: "center",
            }}
        >
            <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} My Website. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
