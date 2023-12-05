import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SnackbarAlert from "../common/SnackBarAlert";

const UploadGoals = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("Example");
    const [loading, setLoading] = useState(false);
    const [cedula, setCedula] = useState();
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, acceptedFiles, getInputProps, isDragActive } = useDropzone({
        accept: { "application/csv": [".xlsx"] },
        onDrop,
    });

    const files = useCallback(
        () =>
            acceptedFiles.map((file) => (
                <Box key={file.path}>
                    {file.path} - {file.size} bytes
                </Box>
            )),
        [acceptedFiles]
    );

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            setFileName(files());
        }
    }, [acceptedFiles, files]);

    const handleSave = async () => {
        setLoading(true);

        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("cedula", cedula);
            let path;
            if (selectedFile.name.includes("meta")) {
                path = "https://insights-api.cyc-bpo.com/goals/";
            } else if (selectedFile.name.toUpperCase().includes("ROBINSON")) {
                path = "https://insights-api.cyc-bpo.com/files/robinson-list/";
            } else {
                showSnack("error", "La nomenclatura del archivo no es correcta.");
                return;
            }
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
                    if (path === "https://insights-api.cyc-bpo.com/goals/") {
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

    const handleCloseSnack = () => setOpenSnack(false);

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Typography variant="h6" sx={{ color: "primary.main", mb: "55px", fontSize: "30px" }}>
                Cargue de Archivos
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    width: "70%",
                    height: "50vh",
                    border: isDragActive ? "2px dashed #0076A8" : "2px dashed #ccc",
                    borderRadius: "8px",
                    p: "20px",
                    color: "#ccc",
                    backgroundColor: "#fafafa",
                    transition: "border-color 0.2s ease-in-out",
                    "&:hover": {
                        borderColor: "#0076A8",
                        color: "#0076A8",
                    },
                }}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            color: "#0076a8",
                        }}
                    >
                        <CloudUploadIcon sx={{ fontSize: "150px", color: "primary.main" }} />
                        <Typography sx={{ color: "primary.main" }} variant="subtitle2">
                            Suelta el archivo aquí ...
                        </Typography>{" "}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            transition: "all .6s ease",
                        }}
                    >
                        <UploadFileIcon
                            sx={{
                                fontSize: "150px",
                            }}
                        />
                        <Typography variant="subtitle2">Arrastre y suelte el archivo aquí, o haga clic para seleccionar el archivo</Typography>
                    </Box>
                )}
            </Box>
            <Collapse sx={{ width: "70%" }} in={acceptedFiles.length > 0}>
                <Box
                    sx={{
                        pt: "15px",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "25px",
                    }}
                >
                    <Typography variant="h6" sx={{ color: "primary.main", fontSize: "16px" }}>
                        {fileName}
                    </Typography>
                    <LoadingButton startIcon={<UploadFileIcon />} onClick={handleSave} loading={loading} loadingPosition="start">
                        Subir
                    </LoadingButton>{" "}
                </Box>
            </Collapse>
            <SnackbarAlert openSnack={openSnack} closeSnack={handleCloseSnack} severity={severity} message={message} />
        </Box>
    );
};

export default UploadGoals;
