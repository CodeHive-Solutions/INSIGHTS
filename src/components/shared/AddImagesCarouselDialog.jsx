import { useState } from 'react';

// Libraries
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Material-UI
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    MenuItem,
    Box,
    DialogContentText,
    LinearProgress,
    Fade,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Collapse,
} from '@mui/material';

// Custom components and assets
import { getApiUrl } from '../../assets/getApi';
import { handleError } from '../../assets/handleError';
import SnackbarAlert from '../common/SnackBarAlert';

registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
);

const AddImagesCarouselDialog = ({
    openAddDialog,
    setOpenAddDialog,
    currentImages,
    getCarouselImages,
    setImages,
}) => {
    const [image, setImage] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [loadingBar, setLoadingBar] = useState(false);
    const [openCollapse, setOpenCollapse] = useState(false);

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

    const showSnack = (severity, message) => {
        setMessage(message);
        setSeverity(severity);
        setOpenSnack(true);
    };

    const createFormData = (image, position, link) => {
        const formData = new FormData();
        formData.append('image', image[0]);
        formData.append('title', image[0].name);
        formData.append('order', position);
        if (link) {
            formData.append('link', link);
        }
        return formData;
    };

    const validateFormData = (image) => {
        if (image.length === 0) {
            showSnack('error', 'Debes añadir una imagen');
            setLoadingBar(false);
            return false;
        }
        return true;
    };

    const sendApiRequest = async (formData) => {
        try {
            const response = await fetch(
                `${getApiUrl().apiUrl}carousel-images/banners/`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                }
            );

            await handleError(response, showSnack);

            if (response.status === 201) {
                getCarouselImages(setImages, showSnack);
                showSnack('success', 'Imagen añadida correctamente');
            }
        } catch (error) {
            if (getApiUrl().environment === 'development') {
                console.error(error);
            }
        } finally {
            setOpenAddDialog(false);
            setLoadingBar(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const position = event.target.position.value;
        const link = openCollapse ? event.target.link.value : '';

        if (!validateFormData(image)) return;

        const formData = createFormData(image, position, link);
        await sendApiRequest(formData);
    };

    return (
        <Box>
            <Fade in={loadingBar}>
                <LinearProgress sx={{ zIndex: '1301' }} color="secondary" />
            </Fade>
            <SnackbarAlert
                message={message}
                severity={severity}
                openSnack={openSnack}
                closeSnack={handleCloseSnack}
            />
            <Dialog
                maxWidth={'md'}
                fullWidth={true}
                component="form"
                onSubmit={handleSubmit}
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
            >
                <DialogContent>
                    <Typography variant="h4">Actualizar imagenes</Typography>
                    <DialogContentText
                        sx={{ mb: '1rem' }}
                        id="alert-dialog-slide-description"
                    >
                        Añade la imagen que deseas mostrar en el carousel de la
                        página principal.
                    </DialogContentText>
                    <Box>
                        <FormGroup sx={{ mb: '1rem' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={() =>
                                            setOpenCollapse(!openCollapse)
                                        }
                                    />
                                }
                                label="¿La imagen debería redireccionar a un link?"
                            />
                        </FormGroup>{' '}
                        <Collapse in={openCollapse}>
                            <TextField
                                sx={{
                                    width: '550px',
                                    mb: '2rem',
                                }}
                                name="link"
                                id="link"
                                label="Link"
                                variant="outlined"
                                required={openCollapse}
                                placeholder="intranet.cyc-bpo.com/logged/vacancies/ o forms.office.com/etc"
                            />
                        </Collapse>
                        <TextField
                            id="position"
                            name="position"
                            select
                            required
                            label="Posición"
                            variant="outlined"
                            defaultValue={1}
                            sx={{ width: '550px', mb: '1rem' }}
                        >
                            {currentImages.map((image, index) => (
                                <MenuItem key={index} value={index + 1}>
                                    {index + 1}
                                </MenuItem>
                            ))}
                            <MenuItem value={currentImages.length + 1}>
                                Ultima posición
                            </MenuItem>
                        </TextField>
                        <FilePond
                            required
                            allowMultiple={true}
                            maxFiles={1}
                            imagePreviewHeight={470}
                            allowFileTypeValidation={true}
                            acceptedFileTypes={['image/*']}
                            onupdatefiles={(fileItems) => {
                                setImage(
                                    fileItems.map((fileItem) => fileItem.file)
                                );
                            }}
                            labelIdle="Arrastra y suelta tu imagen o busca en tu equipo"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => setOpenAddDialog(false)}
                    >
                        Cancelar
                    </Button>
                    <Button variant="contained" type="submit">
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddImagesCarouselDialog;
