import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import asesorNegociacionVacante from "../../images/vacancies/asesor-negociacion-vacante.png";
import asesorComercialVacante from "../../images/vacancies/asesor-comercial-vacante.png";

const MediaCard = ({ img, handleOpenVacancy }) => {
    return (
        <Card
            sx={{
                width: 500,
                maxWidth: 500,
                textAlign: "left",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                    transform: "scale(1.05)",
                },
            }}
            onClick={() => handleOpenVacancy(img)}
        >
            <CardMedia sx={{ height: 500 }} image={img} />
        </Card>
    );
};

const Vacancies = () => {
    const [openVacancy, setOpenVacancy] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [image, setImage] = useState();
    const [vacancyName, setVacancyName] = useState();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getDataUrl = (img) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL("image/png");
    };

    const constructImage = () => {
        const img = new Image();
        console.log(image);
        img.src = image;
        img.onload = () => {
            const imageData = getDataUrl(img);
            submitApplyVacancy(imageData);
        };
    };

    const submitApplyVacancy = async (imageData) => {
        const formData = new FormData();
        formData.append("image", imageData);
        formData.append("name", vacancyName);
        try {
            const response = await fetch(`${getApiUrl()}services/vacancies/`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

            if (response.status === 200) {
                showSnack("success", "Se ha enviado tu postulación correctamente.");
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
        }
    };

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const handleCloseVacancy = () => setOpenVacancy(false);
    const handleOpenVacancy = (img, vacancyName) => {
        setImage(img);
        setVacancyName(vacancyName);
        setOpenVacancy(true);
    };
    const handleCloseSnack = () => setOpenSnack(false);

    return (
        <>
            <Container
                sx={{
                    height: "max-content",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginY: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }} variant={"h4"}>
                    Vacantes disponibles
                </Typography>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", textAlign: "center", gap: "2rem", flexWrap: "wrap" }}>
                    <MediaCard handleOpenVacancy={() => handleOpenVacancy(asesorComercialVacante, "Asesor Comercial")} img={asesorComercialVacante}></MediaCard>
                    <MediaCard handleOpenVacancy={() => handleOpenVacancy(asesorNegociacionVacante, "Asesor de Negociación")} img={asesorNegociacionVacante}></MediaCard>
                </Box>
            </Container>
            <Dialog open={openVacancy} onClose={handleCloseVacancy} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿Desea aplicar a esta vacante?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Si desea aplicar a esta vacante, de click en el botón de confirmar, tus datos serán enviados automáticamente al area de selección para presentar
                        tu postulación.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseVacancy}>Cancelar</Button>
                    <Button onClick={constructImage}>Confirmar</Button>
                </DialogActions>
            </Dialog>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Vacancies;
