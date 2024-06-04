import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";

//Libraries
import "cally";

//Material UI
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, Collapse, IconButton } from "@mui/material";

const useListener = (ref, event, listener) => {
    useEffect(() => {
        const current = ref.current;

        if (current && listener) {
            current.addEventListener(event, listener);
            return () => current.removeEventListener(event, listener);
        }
    }, [ref, event, listener]);
};

const useProperty = (ref, prop, value) => {
    useEffect(() => {
        if (ref.current) {
            ref.current[prop] = value;
        }
    }, [ref, prop, value]);
};

export const CalendarMonth = forwardRef(function CalendarMonth(props, forwardedRef) {
    return <calendar-month offset={props.offset} ref={forwardedRef} />;
});

export const CalendarRange = forwardRef(function CalendarRange({ onChange, showOutsideDays, firstDayOfWeek, isDateDisallowed, ...props }, forwardedRef) {
    const ref = useRef();
    useImperativeHandle(forwardedRef, () => ref.current, []);
    useListener(ref, "change", onChange);
    useProperty(ref, "isDateDisallowed", isDateDisallowed);

    return <calendar-range ref={ref} show-outside-days={showOutsideDays || undefined} first-day-of-week={firstDayOfWeek} {...props} />;
});

export const CalendarDate = forwardRef(function CalendarDate({ onChange, showOutsideDays, firstDayOfWeek, isDateDisallowed, ...props }, forwardedRef) {
    const ref = useRef();
    useImperativeHandle(forwardedRef, () => ref.current, []);
    useListener(ref, "change", onChange);
    useProperty(ref, "isDateDisallowed", isDateDisallowed);

    return <calendar-date ref={ref} show-outside-days={showOutsideDays || undefined} first-day-of-week={firstDayOfWeek} {...props} />;
});

const Picker = ({ value, onChange }) => {
    return (
        <CalendarRange value={value} onChange={onChange}>
            <IconButton aria-label="Previous" slot="previous">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                </svg>
            </IconButton>
            <IconButton aria-label="Next" slot="next">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                </svg>
            </IconButton>
            <Box sx={{ display: "flex", gap: "2em", justifyContent: "center", flexWrap: "wrap" }}>
                <CalendarMonth />
                <CalendarMonth offset={1} />
            </Box>
        </CalendarRange>
    );
};

const VacationsRequest = ({ openVacation, setOpenVacation }) => {
    const [value, setValue] = useState("");
    const [collapseDate, setCollapseDate] = useState(false);

    const onChange = (event) => {
        if (value === "") {
            setCollapseDate(true);
            return setValue(event.target.value);
        }

        setCollapseDate(false);
        setTimeout(() => {
            setValue(event.target.value);
        }, 200);

        setTimeout(() => {
            setCollapseDate(true);
        }, 200);
    };

    const handleCloseCertification = () => {
        setOpenVacation(false);
        setValue("");
    };

    const sendCertification = () => {
        setOpenVacation(false);
    };

    return (
        <Dialog maxWidth={"lg"} open={openVacation} onClose={handleCloseCertification} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"¿Solicitud de Vacaciones?"}</DialogTitle>
            <DialogContent sx={{ paddingBottom: 0 }}>
                <DialogContentText id="alert-dialog-description">Selecciona las fechas de inicio y fin de tus vacaciones.</DialogContentText>
                
                <Box sx={{ p: "2rem" }}>
                    <Picker value={value} onChange={onChange} />
                    <Collapse in={!!value}>
                        <Typography sx={{ pt: "2rem" }}>Periodo de vacaciones seleccionado: </Typography>
                        <Collapse in={collapseDate}>
                            <span style={{ fontWeight: 600 }}>{value}</span>
                        </Collapse>
                    </Collapse>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between", px: "2rem" }}>
                <Button variant="contained" onClick={handleCloseCertification}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={sendCertification}>
                    Solicitar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VacationsRequest;
