import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import videoURL from "../../videos/futbol.mp4";

import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi";
import { useNavigate } from "react-router-dom";

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
    if (image.includes("vacancies")) {
        console.log(image);
    }
};

function Item(props) {
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [isVacancy, setIsVacancy] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.item.image.includes("vacancies")) {
            setIsVacancy(true);
        }
    }, []);

    const handleCloseSnack = () => setOpenSnack(false);

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const { item, height, contain, width, day } = props;
    const { name, description, image, video } = item;
    if (video) {
        return (
            <video style={{ borderRadius: "8px" }} controls width="90%" height="650px">
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    } else {
        

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

        const handleClickOpen = () => {
            if (isVacancy) navigate("/logged/vacancies/");
        };

        return (
            <>
                <Box>
                    <Box>
                        <Box
                            onClick={() => handleClickOpen()}
                            sx={{
                                height: height,
                                width: width,
                                backgroundSize: contain ? "contain" : "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundImage: `url(${image})`,
                                borderRadius: "15px",
                                cursor: isVacancy ? "pointer" : "default",
                            }}
                        ></Box>
                    </Box>
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
                <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
            </>
        );
    }
}

export default CarouselComponent;
