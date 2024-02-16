import React, { useEffect, useState } from "react";
import { MenuItem, ListItemIcon, Dialog, Typography } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { getApiUrl } from "../../assets/getApi";
import SnackbarAlert from "../common/SnackBarAlert";

const Goals = ({ openDialog, setOpenDialog, showSnack }) => {
    const claroGoalsHeader = {
        franja: "Franja",
        metaDiaria: "Meta diaria",
        Dias: "Dias",
        metaMesConPago: "Meta mes con pago",
        porHora: "Por hora",
        recaudoPorCuenta: "Recaudo por cuenta",
    };

    const generalGoalHeader = {
        variableMedir: "Variable a medir",
        cantidad: "Cantidad",
    };

    const [goalAccepted, setGoalAccepted] = useState(false);
    const [goalDeclined, setGoalDeclined] = useState(false);
    const [goalAdvisorClaro, setGoalAdvisorClaro] = useState([]);
    const [goalQuantity, setGoalQuantity] = useState();
    const [goalCriteria, setGoalCriteria] = useState();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [executionAcceptedGoal, setExecutionAcceptedGoal] = useState(false);
    const [executionDeclinedGoal, setExecutionDeclinedGoal] = useState(false);
    const [executionTotalGoal, setExecutionTotalGoal] = useState();
    const [result, setResult] = useState();
    const [evaluation, setEvaluation] = useState();
    const [quality, setQuality] = useState();
    const [cleanDesk, setCleanDesk] = useState();
    const [total, setTotal] = useState();
    const [textConfirmDialog, setTextConfirmDialog] = useState("");
    const [status, setStatus] = useState(null);
    const [goalType, setGoalType] = useState();
    const cedula = JSON.parse(localStorage.getItem("cedula"));

    const handleCloseDialog = () => setOpenDialog(false);
    const handleOpenDialog = () => setOpenDialog(true);

    const getGoal = async () => {
        try {
            const response = await fetch(`${getApiUrl()}goals/${cedula}/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            if (response.status === 200) {
                if (data.accepted) {
                    setGoalAccepted(true);
                } else if (data.accepted === 0) {
                    setGoalDeclined(true);
                } else if (data.additional_info.length > 0) {
                    setGoalAdvisorClaro(data.additional_info);
                } else if (data.quantity_goal && data.criteria_goal) {
                    setGoalQuantity(data.quantity_goal);
                    setGoalCriteria(data.criteria_goal);
                }
                if (data.accepted_execution) {
                    setExecutionAcceptedGoal(true);
                } else if (data.accepted_execution === false) {
                    setExecutionDeclinedGoal(true);
                } else if (data.total) {
                    setExecutionTotalGoal(true);
                    setResult(data.result);
                    setEvaluation(data.evaluation);
                    setQuality(data.quality);
                    setCleanDesk(data.clean_desk);
                    setTotal(data.total);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGoal();
    }, []);

    const handleActionRequest = async () => {
        const body = {
            [goalType]: status,
        };
        try {
            const response = await fetch(`${getApiUrl()}goals/${cedula}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                credentials: "include",
            });
            if (!response.ok) {
                const data = await response.json();
                console.error(data);
                throw new Error(response.statusText);
            }
            if (response.status === 200) {
                getGoal();
                setOpenConfirmDialog(false);
                setOpenDialog(false);
                showSnack("success", "La acción ha sido realizada con éxito");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleGoalAction = (status, goalType) => {
        if (status === "undo") {
            setTextConfirmDialog("¿Deshacer el rechazo y aceptar la meta?");
            setStatus(true);
            setGoalType(goalType);
        } else if (status === true) {
            setTextConfirmDialog("¿Está seguro de aceptar la meta?");
            setStatus(true);
            setGoalType(goalType);
        } else {
            setTextConfirmDialog("¿Está seguro de rechazar la meta?");
            setStatus(false);
            setGoalType(goalType);
        }
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    return (
        <>
            <Dialog open={openDialog} fullWidth maxWidth={"lg"} onClose={handleCloseDialog}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Typography variant={"h5"} sx={{ textAlign: "center", pt: "15px", color: "primary.main" }}>
                        Entrega de Meta
                    </Typography>
                    {goalDeclined ? (
                        <>
                            <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                                Meta de Entrega Rechazada
                            </Typography>
                            <Box sx={{ textAlign: "center" }}>
                                <Button variant="contained" onClick={() => handleGoalAction("undo", "accepted")}>
                                    Reconsiderar y aceptar la meta
                                </Button>
                            </Box>
                        </>
                    ) : goalAccepted ? (
                        <>
                            <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                                Meta de Entrega Aceptada
                            </Typography>
                        </>
                    ) : goalAdvisorClaro.length == 0 && !goalQuantity ? (
                        <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                            Su meta de entrega aun no ha sido subida
                        </Typography>
                    ) : (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            <Box sx={{ display: "flex", gap: "2rem", width: "100%", alignItems: "center", justifyContent: "center" }}>
                                <Button variant="contained" onClick={() => handleGoalAction(true, "accepted")}>
                                    Aceptar
                                </Button>
                                <Button variant="contained" onClick={() => handleGoalAction(false, "accepted")}>
                                    Rechazar
                                </Button>
                            </Box>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            {goalAdvisorClaro.length > 0
                                                ? Object.values(claroGoalsHeader).map((header) => (
                                                      <TableCell align="center" key={header}>
                                                          {header}
                                                      </TableCell>
                                                  ))
                                                : Object.values(generalGoalHeader).map((header) => (
                                                      <TableCell align="center" key={header}>
                                                          {header}
                                                      </TableCell>
                                                  ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {goalAdvisorClaro.length > 0 ? (
                                            goalAdvisorClaro.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="center">{row.fringe}</TableCell>
                                                    <TableCell align="center">{row.diary_goal}</TableCell>
                                                    <TableCell align="center">{row.days}</TableCell>
                                                    <TableCell align="center">{row.month_goal}</TableCell>
                                                    <TableCell align="center">{row.hours}</TableCell>
                                                    <TableCell align="center">{row.collection_account}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : goalQuantity ? (
                                            <TableRow>
                                                <TableCell align="center">{goalCriteria}</TableCell>
                                                <TableCell align="center">{goalQuantity}</TableCell>
                                            </TableRow>
                                        ) : null}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                    <Typography variant={"h5"} sx={{ textAlign: "center", pt: "15px", color: "primary.main" }}>
                        Ejecución de Meta
                    </Typography>
                    {executionDeclinedGoal ? (
                        <>
                            <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                                Meta Rechazada
                            </Typography>
                            <Box sx={{ textAlign: "center" }}>
                                <Button variant="contained" onClick={() => handleGoalAction("undo", "accepted_execution")}>
                                    Reconsiderar y aceptar la meta
                                </Button>
                            </Box>
                        </>
                    ) : executionAcceptedGoal ? (
                        <>
                            <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                                Meta Aceptada
                            </Typography>
                        </>
                    ) : executionTotalGoal ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            <Box sx={{ display: "flex", gap: "2rem", width: "100%", alignItems: "center", justifyContent: "center" }}>
                                <Button variant="contained" onClick={() => handleGoalAction(true, "accepted_execution")}>
                                    Aceptar
                                </Button>
                                <Button variant="contained" onClick={() => handleGoalAction(false, "accepted_execution")}>
                                    Rechazar
                                </Button>
                            </Box>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="right">Clean Desk</TableCell>
                                            <TableCell align="right">Evaluación</TableCell>
                                            <TableCell align="right">Resultado</TableCell>
                                            <TableCell align="right">Calidad</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="right">{cleanDesk}</TableCell>
                                            <TableCell align="right">{evaluation}</TableCell>
                                            <TableCell align="right">{result}</TableCell>
                                            <TableCell align="right">{quality}</TableCell>
                                            <TableCell align="right">{total}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ) : (
                        <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                            Su meta de ejecución correspondiente aun no ha sido subida
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{textConfirmDialog}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">¿Está seguro de continuar con esta acción?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleActionRequest}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Goals;
