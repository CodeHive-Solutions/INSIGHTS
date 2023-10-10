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

    const [goalAccepted, setGoalAccepted] = useState(false);
    const [goalDeclined, setGoalDeclined] = useState(false);
    const [goalAdvisorClaro, setGoalAdvisorClaro] = useState([]);
    const [goalQuantity, setGoalQuantity] = useState();
    const [goalCriteria, setGoalCriteria] = useState();

    const [executionAcceptedGoal, setExecutionAcceptedGoal] = useState(false);
    const [executionDeclinedGoal, setExecutionDeclinedGoal] = useState(false);
    const handleCloseDialog = () => setOpenDialog(false);
    const handleOpenDialog = () => setOpenDialog(true);

    const getGoals = async () => {
        try {
            const response = await fetch("https://insights-api-dev.cyc-bpo.com/goals/15225716/", {
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
                } else if (data.declined) {
                    setGoalDeclined(true);
                } else if (data.additional_info.length > 0) {
                    setGoalAdvisorClaro(data.additional_info);
                    console.log(data.additional_info);
                } else if (data.quantity && data.criteria) {
                    setGoalQuantity(data.quantity);
                    setGoalCriteria(data.criteria);
                }
                if (data.executionAccepted) {
                    setExecutionAcceptedGoal(true);
                } else if (data.executionDeclined) {
                    setExecutionDeclinedGoal(true);
                } else if (data.total) {
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGoals();
    }, []);

    return (
        <Dialog open={openDialog} fullWidth maxWidth={"lg"} onClose={handleCloseDialog}>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Typography variant={"h5"} sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }}>
                    Entrega de Meta
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {goalAdvisorClaro
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
                            {goalAdvisorClaro ? (
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
                            ) : (
                                <TableRow>
                                    <TableCell align="center">{goalCriteria}</TableCell>
                                    <TableCell align="center">{goalQuantity}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant={"h5"} sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }}>
                    Ejecución de Meta
                </Typography>
                {}
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
                                <TableCell align="right">100.00%</TableCell>
                                <TableCell align="right">100.00%</TableCell>
                                <TableCell align="right">100.00%</TableCell>
                                <TableCell align="right">100.00%</TableCell>
                                <TableCell align="right">100.00%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

export default Goals;
