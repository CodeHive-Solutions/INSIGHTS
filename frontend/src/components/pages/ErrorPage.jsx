import { useEffect } from 'react';

// Libraries
import { useRouteError, useNavigate } from 'react-router-dom';

// Material-UI
import { Typography, Box, Button } from '@mui/material';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Custom Components
import Navbar from '../common/NavBar';
import Footer from '../common/Footer';

function ErrorContent({ error }) {
    const navigate = useNavigate();

    const handleGoLogin = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '25px',
            }}
        >
            {error.status === 404 ? (
                <>
                    <Typography variant="h3" gutterBottom>
                        🤔 ¿Te perdiste?
                    </Typography>
                    <Typography variant="subtitle1">
                        La ruta a la que estas accediendo no es correcta
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleGoLogin}
                    >
                        Volver
                    </Button>
                </>
            ) : (
                <>
                    {' '}
                    <Typography variant="h3" gutterBottom>
                        😔 Oops!
                    </Typography>
                    <Typography variant="subtitle1">
                        Lo sentimos, se ha producido un error inesperado.
                    </Typography>
                    <Typography
                        sx={{ textAlign: 'center', width: '50%' }}
                        variant="subtitle2"
                    >
                        {error.statusText || error.message}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleGoLogin}
                    >
                        Volver?
                    </Button>
                </>
            )}
        </Box>
    );
}

export default function ErrorPage({ isLogin }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const error = useRouteError();
    console.error(error);

    if (isLogin) {
        return <ErrorContent error={error} />;
    } else {
        return (
            <>
                <Navbar />
                <ErrorContent error={error} />
                <Footer />
            </>
        );
    }
}
