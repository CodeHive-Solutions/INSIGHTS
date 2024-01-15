import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import videoURL from "../../videos/futbol.mp4";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { Button } from "@mui/material";
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";

function CarouselComponent(props) {
    const { items, height, width, day } = props;

    return (
        <Carousel sx={{ width: width }}>
            {items.map((item, i) => (
                <Item key={i} item={item} day={day} height={height} />
            ))}
        </Carousel>
    );
}

const test = (image) => {
    // if (image === "/src/images/home-carousel/2024.png") {
    console.log(image);
    // }
};

function Item(props) {
    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const handleCloseSnack = () => setOpenSnack(false);

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const { item, height, width, day } = props;
    const { name, description, image, video } = item;
    if (video) {
        return (
            <video style={{ borderRadius: "8px" }} controls width="90%" height="650px">
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    } else {
        const getDataUrl = (img) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            return canvas.toDataURL("image/png");
        };

        const submit = async () => {
            const img = new Image();
            img.src = image;
            let imageData;
            img.onload = () => {
                imageData = getDataUrl(img);
            };
            const formData = new FormData();
            formData.append("image", imageData);
            formData.append("description", description);
            try {
                const response = await fetch(`${getApiUrl()}services/vacancies/`, {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail);
                }

                if (response.status === 200) {
                }
            } catch (error) {
                console.error(error);
                showSnack("error", error.message);
            }
        };

        const handleClickOpen = (image, description) => {
            console.log(description);
            // if ("vacante" in image) {
            setOpen(true);
            // }
        };

        const handleClose = () => {
            setOpen(false);
        };
        return (
            <>
                <Box>
                    <Box
                        onClick={() => handleClickOpen(image, description)}
                        sx={{
                            height: height,
                            width: width,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundImage: `url(${image})`,
                            borderRadius: "15px",
                        }}
                    ></Box>
                    <Box sx={{ padding: "10px" }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {day}
                        </Typography>
                        <Typography gutterBottom variant="subtitle1" component="div">
                            {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    </Box>
                </Box>
                <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"¿Desea aplicar a esta vacante?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Si desea aplicar a esta vacante, de click en el botón de confirmar, tus datos serán enviados automáticamente al area de selección para
                            presentar tu postulación.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={submit} autoFocus>
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
                <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
            </>
        );
    }
}

export default CarouselComponent;
