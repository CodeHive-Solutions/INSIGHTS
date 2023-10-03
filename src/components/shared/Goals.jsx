import React from "react";
import { MenuItem, ListItemIcon } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";

const Goals = () => {
    const getGoals = async () => {
        try {
            const response = await fetch("https://insights-api-dev.cyc-bpo.com/goals/", {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            if (response.status === 200) {
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MenuItem>
            <ListItemIcon>
                <FlagIcon fontSize="small" />
            </ListItemIcon>
            Mi Meta: $250.000.000
        </MenuItem>
    );
};

export default Goals;
