import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SnackbarAlert from "../common/SnackBarAlert";

const UploadGoals = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Subir Excel Metas";
    }, []);

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("Example");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [cedula, setCedula] = useState();

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
                path = "https://insights-api-dev.cyc-bpo.com/goals/";
            } else if (selectedFile.name.includes("robinson")) {
                path = "https://insights-api-dev.cyc-bpo.com/robinson-list/";
            }
            try {
                const response = await fetch(path, {
                    method: "POST",
                    body: formData,
                });

                setLoading(false);
                if (!response.ok) {
                    if (response.status === 500) {
                        console.error("Lo sentimos, se ha producido un error inesperado.");
                        setOpenSnackbar(true);
                        setSnackbarSeverity("error");
                        setSnackbarMessage("Lo sentimos, se ha producido un error inesperado");
                        throw new Error(response.statusText);
                    } else if (response.status === 400) {
                        const data = await response.json();
                        console.error("Lo sentimos, se ha producido un error inesperado.");
                        setOpenSnackbar(true);
                        setSnackbarSeverity("error");
                        setSnackbarMessage(data.message);
                        throw new Error(response.statusText);
                    }

                    const data = await response.json();
                    console.error("Message: " + data.message + " Asesor: " + data.Asesor + " Error: " + data.error);
                    setOpenSnackbar(true);
                    setSnackbarSeverity("error");
                    setSnackbarMessage("Message: " + data.message + " Asesor: " + data.Asesor + " Error: " + data.error);
                    throw new Error(response.statusText);
                }

                if (response.status === 201) {
                    setOpenSnackbar(true);
                    setSnackbarSeverity("success");
                    setSnackbarMessage("Archivo subido exitosamente!");
                    // Handle successful response here
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Typography variant="h6" sx={{ color: "primary.main", mb: "55px", fontSize: "30px" }}>
                CARGUE DE ARCHIVOS
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
            <SnackbarAlert open={openSnackbar} onClose={handleCloseSnackbar} severity={snackbarSeverity} message={snackbarMessage} />
        </Box>
    );
};

export default UploadGoals;
