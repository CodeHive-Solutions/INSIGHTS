import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import cyclogo from "../images/cyc-logo-color.webp";
    
const AboutUs = () => {
    return (
        <Box>
            <Box>
                <img src={cyclogo} alt="" />
            </Box>
            <Box>
                <Typography></Typography>
            </Box>
        </Box>
    );
};

export default AboutUs;
