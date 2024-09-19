// Libraries
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useState, useEffect } from 'react';

// Custom Functions and Components
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';
import AddImagesCarouselDialog from './AddImagesCarouselDialog';
import SnackbarAlert from '../common/SnackBarAlert';

// Iconsg
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

// Material-UI
import { IconButton, Box } from '@mui/material';

const getCarouselImages = async (setImages, showSnack) => {
    try {
        const response = await fetch(
            `${getApiUrl().apiUrl}carousel-images/banners/`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        await handleError(response, showSnack);

        if (response.status === 200) {
            const data = await response.json();

            setImages(data);
            console.log(data);
        }
    } catch (error) {
        if (getApiUrl().environment === 'development') {
            console.error(error);
        }
    }
};

const deleteCarouselImage = async (id, showSnack, setImages) => {
    try {
        const response = await fetch(
            `${getApiUrl().apiUrl}carousel-images/banners/${id}/`,
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        await handleError(response, showSnack);

        if (response.status === 204) {
            showSnack('success', 'Imagen eliminada correctamente');
            getCarouselImages(setImages, showSnack);
        }
    } catch (error) {
        if (getApiUrl().environment === 'development') {
            console.error(error);
        }
    }
};

const IconButtonsStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    '&:hover': {
        backgroundColor: 'white',
        color: 'gray',
    },
    transition: 'all 0.3s',
};

export function EmblaCarousel() {
    const [images, setImages] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState('');
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        getCarouselImages(setImages);
    }, []);

    const showSnack = (severity, message) => {
        setMessage(message);
        setSeverity(severity);
        setOpenSnack(true);
    };

    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 4000, stopOnInteraction: false }),
    ]);

    return (
        <Box>
            <SnackbarAlert
                openSnack={openSnack}
                message={message}
                severity={severity}
            ></SnackbarAlert>
            <AddImagesCarouselDialog
                openAddDialog={openAddDialog}
                setOpenAddDialog={setOpenAddDialog}
                currentImages={images}
                getCarouselImages={getCarouselImages}
                showSnack={showSnack}
            />
            <div
                className="embla"
                style={{ overflow: 'hidden' }}
                ref={emblaRef}
            >
                <div
                    className="embla__container"
                    style={{ display: 'flex', maxWidth: '1280px' }}
                >
                    {images.map((image, index) => (
                        <Box
                            key={index}
                            style={{
                                flex: '0 0 100%',
                                minWidth: 0,
                                maxWidth: '100%',
                                margin: '20px 20px 0 0',
                                position: 'relative',
                            }}
                            className="embla__slide"
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '.5rem',
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                }}
                            >
                                <IconButton
                                    onClick={() =>
                                        deleteCarouselImage(
                                            image.id,
                                            showSnack,
                                            setImages
                                        )
                                    }
                                    sx={IconButtonsStyle}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                                <IconButton sx={IconButtonsStyle}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => setOpenAddDialog(true)}
                                    sx={IconButtonsStyle}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <img
                                width={'100%'}
                                style={{ borderRadius: '1.8rem' }}
                                src={image.image}
                                alt={image.title}
                            />
                        </Box>
                    ))}
                </div>
            </div>
        </Box>
    );
}
