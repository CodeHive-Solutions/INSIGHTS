import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
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

function Item(props) {
    const { item, height, contain, width, day } = props;
    const { name, description, image } = item;
    const [isVacancy, setIsVacancy] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.item.image.includes("vacancies")) {
            setIsVacancy(true);
        }
    }, []);

    const handleClickOpen = () => {
        if (isVacancy) navigate("/logged/vacancies/");
    };

    return (
        <>
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
        </>
    );
}

export default CarouselComponent;
