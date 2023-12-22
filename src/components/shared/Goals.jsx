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

const Goals = ({ openDialog, setOpenDialog }) => {
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

    // const executionHeader = {
    //     clean: "Clean",
    //     desk: "Desk",
    //     evaluacion: "Evaluation",
    //     resultado: "Resultado",
    //     calidad: "Calidad",
    //     total: "Total"
    // }

    const [goalAccepted, setGoalAccepted] = useState(false);
    const [goalDeclined, setGoalDeclined] = useState(false);
    const [goalAdvisorClaro, setGoalAdvisorClaro] = useState([]);
    const [goalQuantity, setGoalQuantity] = useState();
    const [goalCriteria, setGoalCriteria] = useState();
    const [goalCedula, setGoalCedula] = useState();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [executionAcceptedGoal, setExecutionAcceptedGoal] = useState(false);
    const [executionDeclinedGoal, setExecutionDeclinedGoal] = useState(false);
    const [executionTotalGoal, setExecutionTotalGoal] = useState();
    const [result, setResult] = useState();
    const [evaluation, setEvaluation] = useState();
    const [quality, setQuality] = useState();
    const [cleanDesk, setCleanDesk] = useState();
    const [total, setTotal] = useState();
    const handleCloseDialog = () => setOpenDialog(false);
    const handleOpenDialog = () => setOpenDialog(true);

    const handleUndoDeclinedGoal = async (goalType) => {
        const body = {
            accepted: null,
            accepted_at: null,
        };

        if (goalType === "delivery") {
            body.accepted_execution = body.accepted;
            body.accepted_execution_at = body.accepted_at;
            delete body.accepted;
            delete body.accepted_at;
        }

        try {
            const response = await fetch(`${getApiUrl()}goals/${goalCedula}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                console.error(data);
                throw new Error(response.statusText);
            }

            const updatedInstance = await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    const getGoal = async () => {
        try {
            const response = await fetch(`${getApiUrl()}goals/5202927/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            if (response.status === 200) {
                setGoalCedula(data.cedula);
                if (data.accepted) {
                    setGoalAccepted(true);
                } else if (data.declined) {
                    setGoalDeclined(true);
                } else if (data.additional_info.length > 0) {
                    setGoalAdvisorClaro(data.additional_info);
                } else if (data.quantity_goal && data.criteria_goal) {
                    setGoalQuantity(data.quantity_goal);
                    setGoalCriteria(data.criteria_goal);
                }
                if (data.executionAccepted) {
                    setExecutionAcceptedGoal(true);
                } else if (data.executionDeclined) {
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

    const handleGoalAction = async (status, goalType) => {
        const body = {
            accepted: status,
            accepted_at: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${getApiUrl()}goals/${goalCedula}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                console.error(data);
                throw new Error(response.statusText);
            }

            const updatedInstance = await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

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
                                <Button variant="contained" onClick={handleGoalAction(null, "accepted")}>
                                    Deshacer el rechazo
                                </Button>
                            </Box>
                        </>
                    ) : goalAccepted ? (
                        <>
                            <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                                Meta de Entrega Aceptada
                            </Typography>
                            <Box sx={{ textAlign: "center" }}>
                                <Button variant="contained">detalles</Button>
                            </Box>
                        </>
                    ) : goalAdvisorClaro.length == 0 && !goalQuantity ? (
                        <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                            Su meta de entrega aun no ha sido subida
                        </Typography>
                    ) : (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            <Box sx={{ display: "flex", gap: "2rem", width: "100%", alignItems: "center", justifyContent: "center" }}>
                                <Button variant="contained" onClick={handleGoalAction(true, "accepted")}>
                                    Aceptar
                                </Button>
                                <Button variant="contained">Detalles</Button>
                                <Button variant="contained" onClick={handleGoalAction(false, "accepted")}>
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
                                <Button variant="contained" onClick={handleGoalAction(null, "accepted_execution")}>
                                    Deshacer el rechazo
                                </Button>
                            </Box>
                        </>
                    ) : executionAcceptedGoal ? (
                        <>
                            <Typography variant={"subtitle1"} sx={{ textAlign: "center" }}>
                                Meta Aceptada
                            </Typography>
                            <Box sx={{ textAlign: "center" }}>
                                <Button variant="contained">Detalles</Button>
                            </Box>
                        </>
                    ) : executionTotalGoal ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            <Box sx={{ display: "flex", gap: "2rem", width: "100%", alignItems: "center", justifyContent: "center" }}>
                                <Button variant="contained" onClick={handleGoalAction(true, "accepted_execution")}>
                                    Aceptar
                                </Button>
                                <Button variant="contained">Detalles</Button>
                                <Button variant="contained" onClick={handleGoalAction(false, "accepted_execution")}>
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
                <DialogTitle id="alert-dialog-title">{"¿Aceptar entrega de meta?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Goals;
