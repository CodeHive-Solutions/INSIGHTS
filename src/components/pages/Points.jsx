import { useState, useEffect } from 'react';

// Libraries
import { useNavigate } from 'react-router-dom';

// Custom Components
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';
import { CustomNoResultsOverlay } from '../../assets/CustomNoResultsOverlay';

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
import { styled } from '@mui/material/styles';

// MUI Icons
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// styled the row with the user's cedula
const StyledDataGrid = styled(DataGrid)(() => ({
    '& .super-app-theme--1001185389': {
        backgroundColor: '#cfffe7',
        '&.Mui-selected': {
            backgroundColor: '#b4ffda',
        },
    },
}));

export const Points = () => {
    const [rows, setRows] = useState([]);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState();
    const [openSnack, setOpenSnack] = useState(false);
    const navigate = useNavigate();
    const cedula = JSON.parse(localStorage.getItem('cedula'));
    const permissions = JSON.parse(localStorage.getItem('permissions'));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!permissions || !permissions.includes('vacancy.view_reference')) {
            navigate('/logged/home');
        }
    }, []);

    const getPoints = async () => {
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}users/get-points/`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            await handleError(response, showSnack);

            if (response.status === 200) {
                const data = await response.json();
                // assign a unique id to each row based on the order of the data
                data.forEach((element, index) => {
                    element.id = index + 1;
                }, []);
                // move the row with the user's cedula to the first position
                const user = data.find((element) => element.cedula === cedula);
                data.splice(data.indexOf(user), 1);
                data.unshift(user);

                setRows(data);
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getPoints();
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
        {
            field: 'id',
            headerName: 'Puesto',
            width: 100,
            editable: false,
            type: 'number',
            renderCell: (params) => {
                if (params.row.id === 1)
                    return <EmojiEventsIcon sx={{ color: '#ffdc00' }} />;
                else if (params.row.id === 2)
                    return <EmojiEventsIcon sx={{ color: 'gray' }} />;
                else if (params.row.id === 3)
                    return <EmojiEventsIcon sx={{ color: '#9c6800' }} />;
                else return `#${params.row.id}`;
            },
        },
        { field: 'name', headerName: 'Nombre', width: 350, editable: false },
        { field: 'area', headerName: 'Area', width: 250, editable: false },
        {
            field: 'points',
            type: 'number',
            headerName: 'Numero de puntos',
            width: 150,
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
                    Tabla de Clasificación de Puntos C&C
                </Typography>
                <Box
                    sx={{
                        height: '80vh',
                        boxShadow: '0px 0px 5px 0px #e0e0e0',
                        borderRadius: '10px',
                    }}
                >
                    <StyledDataGrid
                        loading={rows.length === 0}
                        columns={columns}
                        rows={rows}
                        getRowClassName={(params) =>
                            `super-app-theme--${params.row.cedula}`
                        }
                        slotProps={{
                            loadingOverlay: {
                                variant: 'skeleton',
                                noRowsVariant: 'skeleton',
                            },
                        }}
                        slots={{
                            toolbar: CustomToolbar,
                            noResultsOverlay: CustomNoResultsOverlay,
                        }}
                    ></StyledDataGrid>
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

export default Points;
