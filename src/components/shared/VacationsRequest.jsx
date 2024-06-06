import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";

//Libraries
import "cally";

//Material UI
import {
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    Collapse,
    IconButton,
    TextField,
    MenuItem,
} from "@mui/material";

// Custom Components
import { getApiUrl } from "../../assets/getApi";

// Icons
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
    const [collapseDate, setCollapseDate] = useState(true);
    const [employeesInCharge, setEmployeesInCharge] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("SUBIR CARTA DE SOLICITUD DE VACACIONES");

    useEffect(() => {
        getEmployeesInCharge();
    }, []);

    const getEmployeesInCharge = async () => {
        try {
            const response = await fetch(`${getApiUrl()}test/`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 500) {
                    showSnack("error", "Error en el servidor, por favor intente más tarde", true);
                    throw new Error(data.detail);
                }
                showSnack("error", data.error, true);
            } else if (response.status === 200) {
                setEmployeesInCharge(data.employees);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const VisuallyHiddenInput = styled("input")({
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: 1,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        whiteSpace: "nowrap",
        width: 1,
    });

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);
        setSelectedFile(file);
    };

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

    const handleCloseVacationDialog = () => {
        setOpenVacation(false);
        setValue("");
        setFileName("SUBIR CARTA DE SOLICITUD DE VACACIONES");
        setSelectedFile(null);
    };

    const handleSubmitVacationRequest = async () => {
        const formData = new FormData();
        formData.append("request_file", selectedFile);
        formData.append("start_date", value.split("/")[0]);
        formData.append("end_date", value.split("/")[1]);
        formData.append("user", 1); // Hardcoded for now

        try {
            const response = await fetch(`${getApiUrl()}vacation/`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 500) {
                    showSnack("error", "Error en el servidor, por favor intente más tarde", true);
                    throw new Error(data.detail);
                }
                showSnack("error", data.error, true);
            } else if (response.status === 200) {
                handleCloseVacationDialog();
                showSnack("success", "Solicitud de vacaciones enviada correctamente");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog maxWidth={"lg"} open={openVacation} onClose={handleCloseVacationDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"¿Solicitud de Vacaciones?"}</DialogTitle>
            <DialogContent sx={{ paddingBottom: 0 }}>
                <DialogContentText id="alert-dialog-description"></DialogContentText>
                <Box sx={{ p: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <TextField select label="Empleado" sx={{ width: "535px" }}>
                        {employeesInCharge.map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box>
                        <Button sx={{ width: "535px" }} component="label" variant="contained" startIcon={<UploadFileIcon />}>
                            {fileName}
                            <VisuallyHiddenInput accept=".pdf" type="file" onChange={handleFileInputChange} />
                        </Button>
                    </Box>

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
                <Button variant="contained" onClick={handleCloseVacationDialog}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleSubmitVacationRequest}>
                    Solicitar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VacationsRequest;
