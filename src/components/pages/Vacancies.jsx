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
import AddIcon from "@mui/icons-material/Add";

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
    const [vacancyId, setVacancyId] = useState();
    const [openCollapse, setOpenCollapse] = useState(false);
    const [openAddVacancy, setOpenAddVacancy] = useState(false);
    const nameAddVacancy = useRef();
    const nameRef = useRef();
    const phoneNumberRef = useRef();
    const [fileImage, setFileImage] = useState();
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const addPermission = permissions.includes("vacancy.add_vacancy");
    const [vacancies, setVacancies] = useState([{}]);
    const [imageName, setImageName] = useState("Subir Imagen");
    const [vacancyDescription, setVacancyDescription] = useState(
        "Si desea aplicar a esta vacante, de click en el botón de confirmar, tus datos serán enviados automáticamente al area de selección para presentar tu postulación."
    );

    const getVacancies = async () => {
        try {
            const response = await fetch(`${getApiUrl()}vacancy/vacancy/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            if (response.status === 200) {
                setVacancies(data);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
            setOpenCollapse(false);
            setOpenVacancy(false);
        }
    };

    useEffect(() => {
        getVacancies();
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

    const submitReferVacancy = async () => {
        const formData = new FormData();
        formData.append("vacancy", vacancyId);
        formData.append("phone_number", phoneNumberRef.current.value);
        formData.append("name", nameRef.current.value);
        try {
            const response = await fetch(`${getApiUrl()}vacancy/reference/`, {
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
                setOpenCollapse(false);
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
            setOpenCollapse(false);
            setOpenVacancy(false);
        }
    };

    const submitApplyVacancy = async () => {
        const formData = new FormData();
        formData.append("vacancy", vacancyId);
        try {
            const response = await fetch(`${getApiUrl()}vacancy/apply/`, {
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

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const handleCloseVacancy = () => {
        setOpenVacancy(false);
        setOpenCollapse(false);
    };

    const handleCloseAddVacancy = () => {
        setOpenAddVacancy(false);
        setFileImage(null);
        setImageName("Cargar Imagen");
    };

    const submitAddVacancy = async () => {
        const formData = new FormData();
        formData.append("vacancy_name", nameAddVacancy.current.value);
        formData.append("image", fileImage);

        try {
            const response = await fetch(`${getApiUrl()}vacancy/vacancy/`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data);
            }

            if (response.status === 201) {
                getVacancies();
                showSnack("success", "La vacante ha sido añadida correctamente.");
                setOpenAddVacancy(false);
                setFileImage(null);
                setImageName("Cargar Imagen");
            }
        } catch (error) {
            console.error(error);
            showSnack("error", error.message);
            setFileImage(null);
            setImageName("Cargar Imagen");
            setOpenAddVacancy(false);
        }
    };

    const handleOpenVacancy = (img, vacancyName, vacancyId) => {
        setImage(img);
        setVacancyId(vacancyId);
        setOpenVacancy(true);
    };

    const handleOpenAddVacancy = () => setOpenAddVacancy(true);

    const handleCloseSnack = () => setOpenSnack(false);
    const handleOpenCollapse = () => {
        setOpenCollapse(true);
        setVacancyDescription(
            "Si estás interesado en postular un referido a esta vacante, llena los datos que se solicitan, estos serán enviados automáticamente al área de selección."
        );
    };

    const handleCloseCollapse = () => {
        setOpenCollapse(false);
        setVacancyDescription(
            "Si desea aplicar a esta vacante, de click en el botón de confirmar, tus datos serán enviados automáticamente al area de selección para presentar tu postulación."
        );
    };

    const handleFileInputChange = (event) => {
        setImageName(event.target.files[0].name);
        setFileImage(event.target.files[0]);
    };

    return (
        <>
            <Container
                sx={{
                    height: "max-content",
                    width: "100%",
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginY: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }} variant={"h4"}>
                    Vacantes disponibles
                </Typography>
                {addPermission && (
                    <Button variant="contained" startIcon={<AddIcon></AddIcon>} onClick={handleOpenAddVacancy}>
                        Añadir
                    </Button>
                )}
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", textAlign: "center", gap: "2rem", flexWrap: "wrap" }}>
                    {vacancies.map((vacancy, index) => {
                        return (
                            <MediaCard
                                key={index}
                                handleOpenVacancy={() => handleOpenVacancy(vacancy.image, vacancy.vacancy_name, vacancy.id)}
                                img={vacancy.image}
                            ></MediaCard>
                        );
                    })}
                </Box>
            </Container>
            <Dialog open={openAddVacancy} onClose={handleCloseAddVacancy} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿Desea añadir una nueva vacante?"}</DialogTitle>

                <Box sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
                    <TextField inputRef={nameAddVacancy} sx={{ width: "400px", mb: "1rem" }} label="Nombre de la Vacante"></TextField>
                    <Box sx={{ display: "flex", height: "56px", justifyContent: "center", width: "400px" }}>
                        <Button sx={{ width: "100%", overflow: "hidden" }} variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                            {imageName}
                            <VisuallyHiddenInput
                                id="file"
                                name="file"
                                type="file"
                                accept=".jpg, .png, .jpeg, .webp"
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
                    <DialogContentText id="alert-dialog-description">{vacancyDescription}</DialogContentText>
                </DialogContent>
                <Collapse in={openCollapse}>
                    <Box sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
                        <TextField inputRef={nameRef} sx={{ width: "400px", mb: "1rem" }} label="Nombre del referido"></TextField>
                        <TextField inputRef={phoneNumberRef} sx={{ width: "400px", mb: "1rem" }} label="Numero de celular del referido"></TextField>
                        <Box sx={{ display: "flex", gap: "2rem" }}>
                            <Button onClick={handleCloseCollapse}>Cancelar</Button>
                            <Button onClick={submitReferVacancy}>Enviar</Button>
                        </Box>
                    </Box>
                </Collapse>
                <Collapse in={!openCollapse}>
                    <DialogActions>
                        <Button onClick={handleCloseVacancy}>Cancelar</Button>
                        <Button onClick={handleOpenCollapse}>Referir a un conocido</Button>
                        <Button onClick={submitApplyVacancy}>Confirmar</Button>
                    </DialogActions>
                </Collapse>
            </Dialog>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Vacancies;
