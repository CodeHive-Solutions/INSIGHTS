import React from "react";

//Libraries
import "cally";

//Material UI
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from "@mui/material";

const VacationsRequest = ({ openVacation, setOpenVacation }) => {
    const handleCloseCertification = () => {
        setOpenVacation(false);
    };

    const sendCertification = () => {
        console.log("Certification sent");
        setOpenVacation(false);
    };

    return (
        <Dialog maxWidth={"lg"} open={openVacation} onClose={handleCloseCertification} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"¿Solicitud de Vacaciones?"}</DialogTitle>
            <DialogContent sx={{ paddingBottom: 0 }}>
                <DialogContentText id="alert-dialog-description">Selecciona las fechas de inicio y fin de tus vacaciones.</DialogContentText>
                <Box sx={{ p: "2rem" }}>
                    <calendar-range months="2">
                        <svg aria-label="Previous" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                        </svg>
                        <svg aria-label="Next" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                        </svg>
                        <Box sx={{ display: "flex", gap: "2em", justifyContent: "center", flexWrap: "wrap" }}>
                            <calendar-month></calendar-month>
                            <calendar-month offset="1"></calendar-month>
                        </Box>
                    </calendar-range>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={handleCloseCertification}>Cancelar</Button>
                <Button onClick={sendCertification}>Enviar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default VacationsRequest;
