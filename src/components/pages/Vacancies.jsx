import React, { useState, useEffect, useRef } from "react";
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
import asesorNegociacionSinExperienciaVacante from "../../images/vacancies/asesor-negociacion-sin-experiencia.png";
import { Collapse } from "@mui/material";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

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
    const [openCollapse, setOpenCollapse] = useState(false);
    const [openAddVacancy, setOpenAddVacancy] = useState(false);
    const nameAddVacancy = useRef();
    const emailRef = useRef();
    const [fileImage, setFileImage] = useState("Subir Imagen");
    const [imageName, setImageName] = useState("");
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    const getDataUrl = (img) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL("image/png");
    };

    const constructImage = (refer) => {
        const img = new Image();
        console.log(image);
        img.src = image;
        img.onload = () => {
            const imageData = getDataUrl(img);
            if (!refer) {
                submitReferVacancy(imageData);
            } else {
                submitApplyVacancy(imageData);
            }
        };
    };

    const submitReferVacancy = async (imageData) => {
        const formData = new FormData();
        formData.append("image", imageData);
        formData.append("vacancy_name", vacancyName);
        formData.append("email", emailRef.current.value);
        try {
            const response = await fetch(`${getApiUrl()}vacancy/send/`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            if (response.status === 200) {
                showSnack("success", "Se ha enviado tu postulación correctamente.");
                setOpenVacancy(false);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
            setOpenVacancy(false);
        }
    };

    const submitApplyVacancy = async (imageData) => {
        const formData = new FormData();
        formData.append("image", imageData);
        formData.append("vacancy", vacancyName);
        try {
            const response = await fetch(`${getApiUrl()}vacancy/`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            if (response.status === 200) {
                showSnack("success", "La información de la vacante ha sido enviada correctamente.");
                setOpenVacancy(false);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
            setOpenVacancy(false);
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
    const handleCloseAddVacancy = () => {
        setOpenAddVacancy(false);
        setFileImage(null);
        setImageName("Cargar Imagen");
    };

    const submitAddVacancy = () => {
        constructImage(true);
        setOpenAddVacancy(false);
    };

    const handleOpenVacancy = (img, vacancyName) => {
        setImage(img);
        setVacancyName(vacancyName);
        setOpenVacancy(true);
    };

    const handleOpenAddVacancy = () => setOpenAddVacancy(true);

    const handleCloseSnack = () => setOpenSnack(false);
    const handleOpenCollapse = () => setOpenCollapse(!openCollapse);

    const handleFileInputChange = (event) => {
        setImageName(event.target.files[0].name);
        setSelectedFile(event.target.files[0]);
    };

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
                <Button onClick={handleOpenAddVacancy}>Añadir</Button>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", textAlign: "center", gap: "2rem", flexWrap: "wrap" }}>
                    <MediaCard handleOpenVacancy={() => handleOpenVacancy(asesorComercialVacante, "Asesor Comercial")} img={asesorComercialVacante}></MediaCard>
                    <MediaCard handleOpenVacancy={() => handleOpenVacancy(asesorNegociacionVacante, "Asesor de Negociación")} img={asesorNegociacionVacante}></MediaCard>
                    <MediaCard
                        handleOpenVacancy={() => handleOpenVacancy(asesorNegociacionSinExperienciaVacante, "Asesor de Negociación Sin Experiencia")}
                        img={asesorNegociacionSinExperienciaVacante}
                    ></MediaCard>
                </Box>
            </Container>
            <Dialog open={openAddVacancy} onClose={handleCloseAddVacancy} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿Desea añadir una nueva vacante?"}</DialogTitle>

                <Box sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
                    <TextField inputRef={nameAddVacancy} sx={{ width: "400px", mb: "1rem" }} label="Nombre de la Vacante"></TextField>
                    <Box sx={{ display: "flex", height: "56px", justifyContent: "center", width: "270px" }}>
                        <Button sx={{ width: "100%", overflow: "hidden" }} variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                            {fileImage}
                            <VisuallyHiddenInput
                                id="file"
                                name="file"
                                type="file"
                                accept=".pdf, .xlsx"
                                onChange={
                                    handleFileInputChange
                                    // Formik doesn't automatically handle file inputs, so we need to manually
                                    // update the 'file' field when a file is selected
                                    // formik.setFieldValue("file", event.currentTarget.files[0]);
                                }
                            />
                        </Button>
                    </Box>
                    <Box sx={{ display: "flex", gap: "2rem" }}>
                        <Button onClick={handleCloseAddVacancy}>Cancelar</Button>
                        <Button onClick={submitAddVacancy}>Guardar</Button>
                    </Box>
                </Box>
            </Dialog>
            <Dialog open={openVacancy} onClose={handleCloseVacancy} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿Desea aplicar a esta vacante?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Si desea aplicar a esta vacante, de click en el botón de confirmar, tus datos serán enviados automáticamente al area de selección para presentar
                        tu postulación.
                    </DialogContentText>
                </DialogContent>
                <Collapse in={openCollapse}>
                    <Box sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
                        <TextField inputRef={emailRef} sx={{ width: "400px", mb: "1rem" }} label="Correo electrónico de la persona a referir"></TextField>
                        <Box sx={{ display: "flex", gap: "2rem" }}>
                            <Button onClick={handleOpenCollapse}>Cancelar</Button>
                            <Button onClick={submitReferVacancy}>Enviar</Button>
                        </Box>
                    </Box>
                </Collapse>
                <Collapse in={!openCollapse}>
                    <DialogActions>
                        <Button onClick={handleCloseVacancy}>Cancelar</Button>
                        <Button onClick={handleOpenCollapse}>Referir a un conocido</Button>
                        <Button onClick={constructImage}>Confirmar</Button>
                    </DialogActions>
                </Collapse>
            </Dialog>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Vacancies;
