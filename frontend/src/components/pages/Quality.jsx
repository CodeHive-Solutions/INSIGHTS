import { useState, useEffect, useRef } from 'react';

// Libraries
import { useNavigate } from 'react-router-dom';

// Custom Components
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';

// Material-UI
import {
    styled,
    TextField,
    Container,
    Box,
    Typography,
    Button,
    Collapse,
    MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// Icons
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';

// Media
import quality from '../../images/quality/files.jpg';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const campaigns = [
    {
        value: 'falabella',
        label: 'Falabella',
        routeOrigin:
            '//172.16.0.46/banco_falabella_call/BOGOTA/LLAMADAS_PREDICTIVO/',
        routeDestination: `172.16.0.12\\Control-Calidad\\PRIVADA\\Llamadas\\Banco Falabella`,
    },
    {
        value: 'banco_agrario',
        label: 'Banco Agrario',
        routeOrigin: '\\172.16.0.106\\banco_agrario_call\\LLAMADAS_PREDICTIVO',
        routeDestination:
            '\\172.16.0.12\\Control-Calidad\\PRIVADA\\Llamadas\\Banco Agrario',
    },
    {
        value: 'CLARO',
        label: 'Claro',
        routeOrigin: 'Por definir',
        routeDestination: 'Por definir',
    },
];

const Quality = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [openCollapse, setOpenCollapse] = useState(true);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]); // Set default campaign
    const callType = useRef();
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem('permissions'));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (
            !permissions ||
            !permissions.includes('excels_processing.call_transfer')
        ) {
            navigate('/logged/home');
        }
    }, []);

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setSelectedFile(file);
            setOpenCollapse(false);
        }
    };

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCampaignChange = (event) => {
        const selectedCampaignValue = event.target.value;
        const campaign = campaigns.find(
            (c) => c.value === selectedCampaignValue
        );
        setSelectedCampaign(campaign);
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const handleUpload = async () => {
        setLoading(true);
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('campaign', selectedCampaign.value);
            formData.append('folder', callType.current.value);

            try {
                const response = await fetch(
                    `${getApiUrl().apiUrl}files/call-transfer-list/`,
                    {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                    }
                );

                await handleError(response, showSnack);

                if (response.status === 200) {
                    const data = await response.json();
                    if (data.fails.length === 0) {
                        showSnack(
                            'success',
                            'Archivos trasladados correctamente.'
                        );
                    } else {
                        const failsString = data.fails.join(', ');
                        showSnack(
                            'success',
                            'Archivos trasladados correctamente. Registros no encontrados: ' +
                                failsString
                        );
                    }
                }
            } catch (error) {
                if (getApiUrl().environment === 'development') {
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        } else {
            showSnack('error', 'No se ha seleccionado un archivo.');
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                className="waveWrapper"
                sx={{
                    width: '100%',
                    height: '49vh',
                    backgroundImage: `url(${quality})`,
                    backgroundSize: 'cover',
                    backgroundColor: '#f0f0f0',
                    padding: '20px',
                }}
            >
                <Typography
                    variant={'h1'}
                    sx={{
                        textAlign: 'center',
                        pb: '15px',
                        color: 'white',
                        pt: '6rem',
                    }}
                >
                    Trasladar Archivos
                </Typography>
                <Box className="wave wave1"></Box>
                <Box className="wave wave2"></Box>
                <Box className="wave wave3"></Box>
                <Box className="wave wave4"></Box>
            </Box>

            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: '51vh',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: '2rem',
                    }}
                >
                    <TextField
                        sx={{ width: '600px' }}
                        value={selectedCampaign.value}
                        onChange={handleCampaignChange}
                        label="Campaña"
                        select
                    >
                        {campaigns.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={{ width: '600px' }}
                        inputRef={callType}
                        label="Tipo de Llamadas"
                        select
                        defaultValue=""
                    >
                        <MenuItem key="inbound" value="in">
                            Inbound
                        </MenuItem>
                        <MenuItem key="outbound" value="out">
                            Outbound
                        </MenuItem>
                    </TextField>
                    <TextField
                        sx={{ width: '600px' }}
                        label="ruta-origen"
                        value={selectedCampaign.routeOrigin}
                        disabled
                    ></TextField>
                    <ArrowDownwardIcon color="primary" />
                    <TextField
                        sx={{ width: '600px' }}
                        label="ruta-destino"
                        value={selectedCampaign.routeDestination}
                        disabled
                    ></TextField>
                    {selectedCampaign.value === 'falabella' ||
                    selectedCampaign.value === 'banco_agrario' ? (
                        <Collapse in={openCollapse}>
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                            >
                                SUBIR ARCHIVO
                                <VisuallyHiddenInput
                                    accept=".csv"
                                    type="file"
                                    onChange={handleFileInputChange}
                                />
                            </Button>
                        </Collapse>
                    ) : null}
                </Box>
                <Collapse in={!openCollapse}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        {selectedCampaign.value === 'falabella' ||
                        selectedCampaign.value === 'banco_agrario' ? (
                            <>
                                <Typography
                                    color="primary.main"
                                    variant="subtitle2"
                                >
                                    {fileName}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: '1rem' }}>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        REMPLAZAR ARCHIVO
                                        <VisuallyHiddenInput
                                            accept=".csv"
                                            type="file"
                                            onChange={handleFileInputChange}
                                        />
                                    </Button>
                                    <LoadingButton
                                        onClick={handleUpload}
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        loading={loading}
                                    >
                                        Trasladar
                                    </LoadingButton>
                                </Box>
                            </>
                        ) : null}
                    </Box>
                </Collapse>
                <SnackbarAlert
                    message={message}
                    severity={severity}
                    openSnack={openSnack}
                    closeSnack={handleCloseSnack}
                />
            </Container>
        </>
    );
};

export default Quality;
