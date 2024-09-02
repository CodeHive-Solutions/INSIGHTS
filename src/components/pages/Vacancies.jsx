import { useState, useEffect, useRef } from "react";

// Custom Components
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import { handleError } from "../../assets/handleError";


// Material-UI
import {
    Container,
    Dialog,
    Collapse,
    styled,
    Typography,
    Card,
    CardMedia,
    Button,
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
    IconButton,
} from "@mui/material";

// Icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";

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
    const inactivatePermission = permissions.includes("vacancy.change_vacancy");
    const [vacancies, setVacancies] = useState([{}]);
    const [imageName, setImageName] = useState("Subir Imagen");
    const [vacancyDescription, setVacancyDescription] = useState(
        "Si desea aplicar a esta vacante, de click en el botón de confirmar, tus datos serán enviados automáticamente al area de selección para presentar tu postulación."
    );
    const [openDialogInactivate, setInactivateDialog] = useState(false);
    const [inactivateId, setInactivateId] = useState();

    const getVacancies = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}vacancy/vacancy/`, {
                method: "GET",
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setVacancies(data);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
            setOpenCollapse(false);
            setOpenVacancy(false);
        }
    };

    useEffect(() => {
        getVacancies();
    }, []);

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

    const submitReferVacancy = async () => {
        const formData = new FormData();
        formData.append("vacancy", vacancyId);
        formData.append("phone_number", phoneNumberRef.current.value);
        formData.append("name", nameRef.current.value);
        try {
            const response = await fetch(`${getApiUrl().apiUrl}vacancy/reference/`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 201) {
                showSnack("success", "La información de la vacante ha sido enviada correctamente.");
            }
            setOpenCollapse(false);
            setOpenVacancy(false);
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
            setOpenCollapse(false);
            setOpenVacancy(false);
        }
    };

    const submitApplyVacancy = async () => {
        const formData = new FormData();
        formData.append("vacancy", vacancyId);
        try {
            const response = await fetch(`${getApiUrl().apiUrl}vacancy/apply/`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                showSnack("success", "Se ha enviado tu postulación correctamente.");
                localStorage.setItem(`vacancy${vacancyId}`, vacancyId);
                setOpenVacancy(false);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
            setOpenVacancy(false);
        }
    };

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
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

    const handleCloseInactiveDialog = () => setInactivateDialog(false);

    const submitAddVacancy = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", nameAddVacancy.current.value);
        formData.append("image", fileImage);

        try {
            const response = await fetch(`${getApiUrl().apiUrl}vacancy/vacancy/`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            await handleError(response, showSnack);

            if (response.status === 201) {
                getVacancies();
                showSnack("success", "La vacante ha sido añadida correctamente.");
                setOpenAddVacancy(false);
                setFileImage(null);
                setImageName("Cargar Imagen");
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
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

    const handleInactiveVacancy = async () => {
        try {
            const response = await fetch(`${getApiUrl().apiUrl}vacancy/vacancy/${inactivateId}/`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({ is_active: false }),
                headers: { "Content-Type": "application/json" },
            });

            await handleError(response, showSnack);

            if (response.status === 200) {
                getVacancies();
                showSnack("success", "La vacante ha sido inactivada correctamente.");
                setInactivateDialog(false);
            }
        } catch (error) {
            if (getApiUrl().environment === "development") {
                console.error(error);
            }
            setInactivateDialog(false);
        }
    };

    return (
        <>
            <Container
                sx={{
                    minHeight: "80vh",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "start",
                    alignItems: "center",
                    flexDirection: "column",
                    marginY: "6rem",
                }}
            >
                <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main" }} variant={"h3"}>
                    Vacantes Disponibles
                </Typography>
                {addPermission && (
                    <Button variant="contained" startIcon={<AddIcon></AddIcon>} onClick={handleOpenAddVacancy}>
                        Añadir
                    </Button>
                )}
                <Box>
                    <Typography color="gray">Si deseas aplicar o referir a una de nuestras de vacantes disponibles selecciona una de ellas y sigue los pasos</Typography>
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", textAlign: "center", gap: "2rem", flexWrap: "wrap" }}>
                    {vacancies.map((vacancy, index) => {
                        return (
                            <Card
                                key={index}
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
                                onClick={() => handleOpenVacancy(vacancy.image, vacancy.vacancy_name, vacancy.id)}
                            >
                                {inactivatePermission && (
                                    <IconButton
                                        sx={{ position: "absolute", top: "10px", right: "10px" }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event propagation
                                            setInactivateDialog(true);
                                            setInactivateId(vacancy.id);
                                        }}
                                        aria-label="delete"
                                    >
                                        <DeleteForeverIcon fontSize="inherit" />
                                    </IconButton>
                                )}
                                {vacancy.image && <CardMedia sx={{ height: 500 }} image={vacancy.image} />}
                            </Card>
                        );
                    })}
                </Box>
            </Container>
            <Dialog open={openAddVacancy} onClose={handleCloseAddVacancy} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"¿Desea añadir una nueva vacante?"}</DialogTitle>

                <Box component="form" onSubmit={submitAddVacancy} sx={{ flexDirection: "column", p: "1rem 1.5rem ", display: "flex", alignItems: "start" }}>
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
                        <Button type="submit">Guardar</Button>
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
                        {localStorage.getItem(`vacancy${vacancyId}`) == vacancyId ? (
                            <Button disabled>Ya has aplicado a esta vacante</Button>
                        ) : (
                            <Button onClick={submitApplyVacancy}>Aplicar</Button>
                        )}

                        {/* <Button onClick={submitApplyVacancy}>Confirmar</Button> */}
                    </DialogActions>
                </Collapse>
            </Dialog>

            <Dialog open={openDialogInactivate} onClose={handleCloseInactiveDialog} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">{"¿Desea inactivar esta vacante?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        La vacante será desactivada y ya no estará disponible, sin embargo, las referencias relacionadas con ella no se perderán.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInactiveDialog}>Cancelar</Button>
                    <Button onClick={handleInactiveVacancy}>Inactivar</Button>
                </DialogActions>
            </Dialog>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Vacancies;
