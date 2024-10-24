import { useState, useEffect } from 'react';

// Libraries
import { useNavigate } from 'react-router-dom';

// Custom Components
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';
import {
    CustomNoResultsOverlay,
    CustomNoRowsOverlay,
} from '../../assets/CustomDataGridOverlays';

// Material-UI
import { Container, Box, Typography } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';

export const VacanciesReferred = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const permissions = JSON.parse(localStorage.getItem('permissions'));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes('vacancy.view_reference')) {
            navigate('/logged/home');
        }
    }, []);

    const getVacanciesReferred = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}vacancy/reference/`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                setRows(data);
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVacanciesReferred();
    }, []);

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const handleCloseSnack = () => setOpenSnack(false);

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={{
                        fileName: 'vacantes-referidas',
                        delimiter: ';',
                        utf8WithBom: true,
                    }}
                />
                <Box sx={{ textAlign: 'end', flex: '1' }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'created_by',
            headerName: 'Persona que refirió',
            width: 250,
            editable: false,
        },
        {
            field: 'name',
            headerName: 'Nombre del Referido',
            width: 250,
            editable: false,
        },
        {
            field: 'phone_number',
            headerName: 'Numero del Referido',
            width: 170,
            editable: false,
        },
        {
            field: 'vacancy',
            headerName: 'Vacante',
            width: 400,
            editable: false,
        },
    ];

    return (
        <>
            <Container
                sx={{
                    marginTop: '6rem',
                }}
            >
                <Typography
                    sx={{
                        textAlign: 'center',
                        pb: '15px',
                        color: 'primary.main',
                    }}
                    variant={'h4'}
                >
                    Vacantes referidas
                </Typography>
                <Box
                    sx={{
                        height: '80vh',
                        boxShadow: '0px 0px 5px 0px #e0e0e0',
                        borderRadius: '10px',
                    }}
                >
                    <DataGrid
                        loading={loading}
                        columns={columns}
                        rows={rows}
                        slots={{
                            toolbar: CustomToolbar,
                            noResultsOverlay: CustomNoResultsOverlay,
                            noRowsOverlay: CustomNoRowsOverlay,
                        }}
                        slotProps={{
                            loadingOverlay: {
                                variant: 'skeleton',
                                noRowsVariant: 'skeleton',
                            },
                        }}
                    ></DataGrid>
                </Box>
            </Container>

            <SnackbarAlert
                message={message}
                severity={severity}
                openSnack={openSnack}
                closeSnack={handleCloseSnack}
            />
        </>
    );
};

export default VacanciesReferred;
