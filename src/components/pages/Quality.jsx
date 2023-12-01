import React, { useState } from "react";
import { TextField, Container, Box, Typography, Button } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import Collapse from "@mui/material/Collapse";
import SaveIcon from "@mui/icons-material/Save";
import quality from "../../images/quality/quality.jpg";
import { LoadingButton } from "@mui/lab";
import SnackbarAlert from "../common/SnackBarAlert";

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

const Quality = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [openCollapse, setOpenCollapse] = useState(true);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);
        setSelectedFile(file);
        setOpenCollapse(false);
    };

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const handleUpload = async () => {
        setLoading(true);
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                const response = await fetch(path, {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });

                setLoading(false);
                if (!response.ok) {
                    if (response.status === 500) {
                        showSnack("error", "Lo sentimos, se ha producido un error inesperado.");
                        throw new Error(response.statusText);
                    } else if (response.status === 400) {
                        const data = await response.json();
                        showSnack("error", data.message);
                        throw new Error(response.statusText);
                    } else if (response.status === 403) {
                        showSnack("error", "No tiene permiso para realizar esta acción.");
                        throw new Error(response.statusText);
                    }

                    const data = await response.json();
                    if (path === "https://insights-api-dev.cyc-bpo.com/goals/") {
                        console.error("Message: " + data.message + " Asesor: " + data.Asesor + " Error: " + data.error);
                        showSnack("error", "Message: " + data.message + " Asesor: " + data.Asesor + " Error: " + data.error);
                        throw new Error(response.statusText);
                    }
                }

                if (response.status === 201) {
                    const data = await response.json();
                    showSnack("success", "Registros subidos: " + data.rows_updated);
                } else if (response.status === 200) {
                    showSnack("warning", "No se encontraron registros para actualizar.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            <Box
                className="waveWrapper"
                sx={{
                    width: "100%",
                    height: "50vh",
                    backgroundImage: `url(${quality})`,
                    backgroundSize: "cover",
                    backgroundColor: "#f0f0f0",
                    padding: "20px",
                }}
            >
                <Typography variant={"h1"} sx={{ textAlign: "center", pb: "15px", color: "white", fontWeight: "400", pt: "6rem" }}>
                    Trasladar Archivos
                </Typography>
                <Box className="wave wave1"></Box>
                <Box className="wave wave2"></Box>
                <Box className="wave wave3"></Box>
                <Box className="wave wave4"></Box>
            </Box>

            <Container sx={{ display: "flex", justifyContent: "start", alignItems: "center", flexDirection: "column", height: "min-content" }}>
                {/* <Box sx={{ textAlign: "center", pt: "2rem" }}>
                    <Typography variant="h3">Trasladar Archivos</Typography>
                </Box> */}
                <Box sx={{ display: "flex", gap: "0.5rem", flexDirection: "column", justifyContent: "center", alignItems: "center", mt: "2rem" }}>
                    <TextField
                        sx={{ width: "600px" }}
                        label="ruta-origen"
                        disabled
                        defaultValue="172.16.0.46/banco_falabella_call/BOGOTA/LLAMADAS_PREDICTIVO/"
                    ></TextField>
                    <ArrowDownwardIcon color="primary" />
                    <TextField
                        sx={{ width: "600px" }}
                        label="ruta-destino"
                        disabled
                        defaultValue="172.16.0.12\Control-Calidad\PRIVADA\Llamadas Banco Falabella"
                    ></TextField>
                    <Collapse in={openCollapse}>
                        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                            SUBIR ARCHIVO
                            <VisuallyHiddenInput accept=".xlsx, .xls" type="file" onChange={handleFileInputChange} />
                        </Button>
                    </Collapse>
                </Box>
                <Collapse in={!openCollapse}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                        <Typography color="primary.main" variant="subtitle2">
                            {fileName}
                        </Typography>
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                REMPLAZAR ARCHIVO
                                <VisuallyHiddenInput accept=".xlsx, .xls" type="file" onChange={handleFileInputChange} />
                            </Button>
                            <LoadingButton onClick={handleUpload} startIcon={<SaveIcon />} variant="contained" loading={loading}>
                                Guardar
                            </LoadingButton>
                        </Box>
                    </Box>
                </Collapse>
            </Container>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Quality;
