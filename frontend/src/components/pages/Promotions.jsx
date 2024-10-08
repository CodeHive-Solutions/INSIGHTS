import { useEffect, useState } from 'react';

// Material-UI
import { Box, Card, Typography, Container } from '@mui/material';

// Custom Components
import CarouselComponent from '../shared/Carousel';
import SnackbarAlert from '../common/SnackBarAlert';
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';

const Promotions = () => {
    const [yesterdayBirthdays, setYesterdayBirthdays] = useState([]);
    const [todayBirthdays, setTodayBirthdays] = useState([]);
    const [tomorrowBirthdays, setTomorrowBirthdays] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

    const showSnack = (severity, message) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
    };

    const fetchImages = async (employees) => {
        const imagePromises = employees.map(async (employee) => {
            try {
                const imageResponse = await fetch(
                    `${getApiUrl(true).apiUrl}profile-picture/${employee.cedula}`,
                    {
                        method: 'GET',
                    }
                );

                const fullName = employee.nombre;

                // Split the full name into individual names and last names
                const nameParts = fullName.split(' ');

                // Extract the first name
                const firstName =
                    nameParts.length === 2
                        ? nameParts[1]
                        : nameParts.length > 2
                          ? nameParts[2]
                          : '';

                // Extract the first last name (if exists)
                const firstLastName = nameParts.length > 0 ? nameParts[0] : '';

                // Create the formatted name
                const formattedName = `${firstName} ${firstLastName}`.trim();

                // Check if the image is found (status 200) and return the image URL
                if (imageResponse.status === 200) {
                    return {
                        image: `${getApiUrl(true)}profile-picture/${employee.cedula}`,
                        name: formattedName,
                        subtitle: 'De asesor de negociación a team líder',
                        description:
                            'Estimados colegas, Quiero expresar mi más sincero agradecimiento por el honor de mi ascenso en la empresa. Es un privilegio asumir este nuevo desafío y estoy profundamente agradecido por la confianza que han depositado en mí.¡Estoy emocionado por contribuir aún más al éxito de nuestro equipo!',
                    };
                }

                // If image not found, return null
                return {
                    image: Avatar,
                    name: formattedName,
                    subtitle: employee.campana_general,
                    description: employee.descripcion,
                };
            } catch (error) {
                if (getApiUrl().environment === 'development') {
                    console.error(error);
                }
            }
        });

        return (await Promise.all(imagePromises)).filter(
            (image) => image !== null
        );
    };

    const getBirthdaysId = async () => {
        try {
            const response = await fetch(
                `${getApiUrl(true).apiUrl}profile-picture/birthday`,
                {
                    method: 'GET',
                }
            );

            const data = await response.json();

            await handleError(response, showSnack);

            if (response.status === 200) {
                const yesterdayBirthdays = data.data.yesterday;
                const todayBirthdays = data.data.today;
                const tomorrowBirthdays = data.data.tomorrow;

                const yesterdayImages = await fetchImages(yesterdayBirthdays);
                const todayImages = await fetchImages(todayBirthdays);
                const tomorrowImages = await fetchImages(tomorrowBirthdays);

                setYesterdayBirthdays(yesterdayImages);
                setTodayBirthdays(todayImages);
                setTomorrowBirthdays(tomorrowImages);
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        getBirthdaysId();
        window.scrollTo(0, 0);
    }, []);

    return (
        <Container sx={{ mt: '5rem' }}>
            <Typography
                sx={{
                    textAlign: 'center',
                    pb: '15px',
                    color: 'primary.main',
                    fontWeight: '500',
                }}
                variant={'h4'}
            >
                Plan Carrera
            </Typography>{' '}
            <Box
                sx={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    p: '1rem',
                }}
            >
                <Card sx={{ maxWidth: 350, width: 350, height: 700 }}>
                    <CarouselComponent
                        items={yesterdayBirthdays}
                        day={'Ayer'}
                        height={'280px'}
                        width={'100%'}
                    />
                </Card>
                <Card sx={{ maxWidth: 350, width: 350, height: 700 }}>
                    <CarouselComponent
                        items={todayBirthdays}
                        day={'Ayer'}
                        height={'280px'}
                        width={'100%'}
                    />
                </Card>
                <Card sx={{ maxWidth: 350, width: 350, height: 700 }}>
                    <CarouselComponent
                        items={tomorrowBirthdays}
                        day={'Ayer'}
                        height={'280px'}
                        width={'100%'}
                    />
                </Card>
                <SnackbarAlert
                    message={message}
                    severity={severity}
                    openSnack={openSnack}
                    closeSnack={handleCloseSnack}
                />
            </Box>
        </Container>
    );
};

export default Promotions;
