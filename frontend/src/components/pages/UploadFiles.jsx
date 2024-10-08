import { useState, useEffect, useCallback } from 'react';

// Libraries
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

// Custom Components
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';

// Material-UI
import { Typography, Box, Collapse } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// Icons
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFiles = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('Example');
    const [loading, setLoading] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (
            !permissions ||
            !permissions.includes('users.upload_robinson_list')
        ) {
            navigate('/logged/home');
        }
    }, []);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, acceptedFiles, getInputProps, isDragActive } =
        useDropzone({
            accept: { 'application/csv': ['.xlsx', '.csv'] },
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
            formData.append('file', selectedFile);
            formData.append('cedula', cedula);
            let path;
            if (selectedFile.name.includes('meta')) {
                path = `${getApiUrl().apiUrl}goals/`;
            } else if (selectedFile.name.toUpperCase().includes('ROBINSON')) {
                path = `${getApiUrl().apiUrl}files/robinson-list/`;
            } else if (selectedFile.name.toUpperCase().includes('BIRTHDAYS')) {
                path = `${getApiUrl(true).apiUrl}massive-update`;
            } else if (selectedFile.name.toUpperCase().includes('PUNTOS-CYC')) {
                path = `${getApiUrl().apiUrl}users/upload-points/`;
            } else {
                showSnack(
                    'error',
                    'La nomenclatura del archivo no es correcta.'
                );
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(path, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                setLoading(false);

                await handleError(response, showSnack);

                const data = await response.json();

                if (
                    response.status === 201 &&
                    path === `${getApiUrl().apiUrl}files/robinson-list/`
                ) {
                    showSnack(
                        'success',
                        'La importación se ejecutó exitosamente, ' +
                            data.rows_updated +
                            ' registros fueron añadidos.\nRegistros totales en la base de datos: ' +
                            data.database_rows
                    );
                } else if (
                    response.status === 200 &&
                    path === `${getApiUrl().apiUrl}files/robinson-list/`
                ) {
                    showSnack(
                        'success',
                        'La importación se ejecutó exitosamente, no se encontraron registros por añadir.\nRegistros totales en la base de datos: ' +
                            data.database_rows
                    );
                } else if (response.status === 200) {
                    showSnack('success', 'El cargue se subió exitosamente.');
                }
            } catch (error) {
                if (getApiUrl().environment === 'development') {
                    console.error(error);
                }
                setLoading(false);
            }
        }
    };

    const handleCloseSnack = () => setOpenSnack(false);

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Typography
                variant={'h3'}
                sx={{ color: 'primary.main', mb: '55px' }}
            >
                Cargue de Archivos
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    width: '70%',
                    height: '50vh',
                    border: isDragActive
                        ? '2px dashed #0076A8'
                        : '2px dashed #ccc',
                    borderRadius: '8px',
                    p: '20px',
                    color: '#ccc',
                    backgroundColor: '#fafafa',
                    transition: 'border-color 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: '#0076A8',
                        color: '#0076A8',
                    },
                }}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            color: '#0076a8',
                        }}
                    >
                        <CloudUploadIcon
                            sx={{ fontSize: '150px', color: 'primary.main' }}
                        />
                        <Typography
                            sx={{ color: 'primary.main' }}
                            variant="subtitle2"
                        >
                            Suelta el archivo aquí ...
                        </Typography>{' '}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            textAlign: 'center',
                            transition: 'all .6s ease',
                        }}
                    >
                        <UploadFileIcon
                            sx={{
                                fontSize: '150px',
                            }}
                        />
                        <Typography variant="subtitle2">
                            Arrastre y suelte el archivo aquí, o haga clic para
                            seleccionar el archivo
                        </Typography>
                    </Box>
                )}
            </Box>
            <Collapse sx={{ width: '70%' }} in={acceptedFiles.length > 0}>
                <Box
                    sx={{
                        pt: '15px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '25px',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ color: 'primary.main', fontSize: '16px' }}
                    >
                        {fileName}
                    </Typography>
                    <LoadingButton
                        startIcon={<UploadFileIcon />}
                        onClick={handleSave}
                        loading={loading}
                        loadingPosition="start"
                    >
                        Subir
                    </LoadingButton>{' '}
                </Box>
            </Collapse>
            <SnackbarAlert
                openSnack={openSnack}
                closeSnack={handleCloseSnack}
                severity={severity}
                message={message}
            />
        </Box>
    );
};

export default UploadFiles;
