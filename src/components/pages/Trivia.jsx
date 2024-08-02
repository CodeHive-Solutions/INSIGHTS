import React, { useState, useEffect } from "react";
import {
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
    Container,
    Box,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Alert,
    LinearProgress,
    Fade,
} from "@mui/material";
import { getApiUrl } from "../../assets/getApi";

// media
import triviaImage from "../../images/trivia/trivia.svg";

// custom components
import { handleError } from "../../assets/handleError";
import isSpecificHourColombia from "../../assets/isSpecificHourColombia";
import SnackbarAlert from "../common/SnackBarAlert";
// libraries
import { useNavigate } from "react-router-dom";

const Trivia = () => {
    const [openTrivia, setOpenTrivia] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [firstTry, setFirstTry] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("error");
    const [disabled, setDisabled] = useState(false);
    const [openCollapse, setOpenCollapse] = useState(false);

    const verifyFirstTry = async () => {
        const response = await fetch(`${getApiUrl().apiUrl}services/check-answered/`, {
            method: "GET",
            credentials: "include",
        });

        await handleError(response, showSnack);

        if (response.status === 200) {
            const data = await response.json();
            setFirstTry(data.answered);
        }
    };

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenTrivia = () => {
        setOpenTrivia(true);
        setStartTime(Date.now());
    };

    const initialSelectedAnswers = {
        question1: "",
        question2: "",
        question3: "",
    };

    const [selectedAnswers, setSelectedAnswers] = useState(initialSelectedAnswers);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);

    useEffect(() => {
        verifyFirstTry();
        if (!isSpecificHourColombia(10)) {
            navigate("/logged/home");
        }

        const questions = [
            {
                id: 1,
                text: "Confidencialidad se refiere a: ",
                options: [
                    "Garantizar que la información sea precisa y completa.",
                    "Asegurar que la información sea accesible solo para aquellos autorizados.",
                    "Mantener la disponibilidad de los sistemas de información.",
                    "Proteger los sistemas contra amenazas externas.",
                ],
            },
            {
                id: 2,
                text: "¿Qué es ingeniería social? ",
                options: [
                    "Un tipo de software antivirus",
                    "Un método de ataque que busca obtener información confidencial engañando a los usuarios",
                    "Un programa de seguridad para proteger contraseñas",
                    "Un sistema de protección del SGSI",
                ],
            },
            {
                id: 3,
                text: "¿Cuál de las siguientes es una señal común de un intento de Smishing? ",
                options: [
                    "Un mensaje de texto solicitando una actualización de información bancaria",
                    "Un mensaje de correo electrónico de una fuente conocida solicitando una reunión",
                    "Un aviso en la pantalla de tu computadora que indica que el sistema está actualizado",
                    "Un mensaje en una red social con una oferta de descuento para productos",
                ],
            },
        ];

        const shuffledQuestions = questions.map((question) => ({
            ...question,
            options: shuffleArray(question.options),
        }));

        setShuffledQuestions(shuffleArray(shuffledQuestions));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (startTime && !endTime) {
                setElapsedTime(Date.now() - startTime);
            }
        }, 1);

        return () => {
            clearInterval(timer);
        };
    }, [startTime, endTime]);

    const shuffleArray = (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const handleChange = (event) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        setOpenCollapse(true);
        setDisabled(true);
        event.preventDefault();
        setEndTime(Date.now());
        const formData = new FormData();
        formData.append("duration", ((Date.now() - startTime) / 1000) * 1000000);
        formData.append("question_1", selectedAnswers.question1);
        formData.append("question_2", selectedAnswers.question2);
        formData.append("question_3", selectedAnswers.question3);
        try {
            const response = await fetch(`${getApiUrl().apiUrl}services/save-answer/`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            await handleError(response);

            if (response.status === 201) {
                setOpenTrivia(false);
                setSelectedAnswers(initialSelectedAnswers);
                setShuffledQuestions([]);
                setElapsedTime(0);
                setStartTime(null);
                setEndTime(null);
                setOpenDialog(true);
                verifyFirstTry();
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
        } finally {
            setOpenCollapse(false);
            setDisabled(false);
        }
    };

    const formatElapsedTime = (elapsedTime) => {
        const seconds = Math.floor(elapsedTime / 1000);
        const milliseconds = (elapsedTime % 1000) / 1000;
        return `${seconds}.${milliseconds.toFixed(1).slice(2)} seconds`;
    };

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

    return (
        <>
            <Fade in={openCollapse}>
                <LinearProgress sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1301 }} variant="query" />
            </Fade>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Resultados guardados"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Respuestas guardadas correctamente, los resultados serán publicados en la intranet próximamente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Container sx={{ minHeight: "80vh" }}>
                <Box sx={{ my: "10rem" }}>
                    <Typography sx={{ textAlign: "center" }} variant="h3" component="h1" gutterBottom>
                        Trivia
                    </Typography>
                    <Box sx={{ textAlign: "center", mb: "1rem" }}>
                        <Collapse in={!openTrivia}>
                            {firstTry ? (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Alert sx={{ width: "60%" }} severity={"info"}>
                                        Ya has respondido la trivia, los resultados serán publicados en la intranet próximamente.
                                    </Alert>
                                    <img src={triviaImage} alt="trivia" style={{ width: "80%", height: "auto" }} />
                                </Box>
                            ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Button sx={{ height: "50px", width: "200px", fontSize: "25px" }} variant="contained" onClick={handleOpenTrivia}>
                                        Empezar
                                    </Button>
                                    <img src={triviaImage} alt="trivia" style={{ width: "80%", height: "auto" }} />
                                </Box>
                            )}
                        </Collapse>
                        <Collapse in={openTrivia}>
                            <Typography variant="h6">Tiempo transcurrido: {formatElapsedTime(elapsedTime)}</Typography>
                        </Collapse>
                    </Box>
                    <Collapse component={"form"} onSubmit={handleSubmit} in={openTrivia}>
                        {shuffledQuestions.map((question) => (
                            <Box key={question.id}>
                                <Typography variant="h6">{question.text}</Typography>
                                <RadioGroup sx={{ mb: "2rem" }} name={`question${question.id}`} value={selectedAnswers[`question${question.id}`]} onChange={handleChange}>
                                    {question.options.map((option, index) => (
                                        <FormControlLabel required key={index} value={option} control={<Radio />} label={option} />
                                    ))}
                                </RadioGroup>
                            </Box>
                        ))}
                        <Box sx={{ textAlign: "end" }}>
                            <Button disabled={disabled} type="submit" variant="contained" color="primary">
                                Guardar
                            </Button>
                        </Box>
                    </Collapse>
                </Box>
            </Container>
        </>
    );
};

export default Trivia;
