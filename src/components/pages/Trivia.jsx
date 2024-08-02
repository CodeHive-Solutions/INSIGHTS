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
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Alert,
} from "@mui/material";
import { getApiUrl } from "../../assets/getApi";

// media
import triviaImage from "../../images/trivia/trivia.svg";

// custom components
import { handleError } from "../../assets/handleError";

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
    const verifyFirstTry = async () => {
        const response = await fetch(`${getApiUrl().apiUrl}/services/check-answered/`, {
            method: "GET",
            credentials: "include",
        });

        await handleError(response);

        if (response.status === 200) {
            const data = await response.json();
            setFirstTry(data.answered);
        }
    };

    function isSpecificHourColombia(hour) {
        // Get the current time in the Colombia timezone
        const colombiaTime = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });
        const currentTimeColombia = new Date(colombiaTime);

        // Check if the current hour matches the specified hour
        const isMatch = currentTimeColombia.getHours() >= hour;

        return isMatch;
    }

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
        if (!isSpecificHourColombia(11)) {
            navigate("/logged");
        }

        const questions = [
            {
                id: 1,
                text: "¿Cuál es la capital de Colombia?",
                options: ["Bogotá", "Medellín", "Cali", "Barranquilla"],
            },
            {
                id: 2,
                text: "¿Cuál es el río más largo del mundo?",
                options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"],
            },
            {
                id: 3,
                text: "¿Quién escribió 'Cien años de soledad'?",
                options: ["Gabriel García Márquez", "Mario Vargas Llosa", "Julio Cortázar", "Carlos Fuentes"],
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
        }
    };

    const formatElapsedTime = (elapsedTime) => {
        const seconds = Math.floor(elapsedTime / 1000);
        const milliseconds = (elapsedTime % 1000) / 1000;
        return `${seconds}.${milliseconds.toFixed(1).slice(2)} seconds`;
    };

    return (
        <>
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
                    <Box sx={{ textAlign: "center" }}>
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
                                <RadioGroup name={`question${question.id}`} value={selectedAnswers[`question${question.id}`]} onChange={handleChange}>
                                    {question.options.map((option, index) => (
                                        <FormControlLabel required key={index} value={option} control={<Radio />} label={option} />
                                    ))}
                                </RadioGroup>
                            </Box>
                        ))}
                        <Box sx={{ textAlign: "end" }}>
                            <Button type="submit" variant="contained" color="primary">
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
