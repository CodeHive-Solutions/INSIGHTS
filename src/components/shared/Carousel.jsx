import { useState, useEffect } from "react";

// Libraries
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";

// Material-UI
import { Box, Typography } from "@mui/material";

function CarouselComponent(props) {
    const { items, height, width, contain, day } = props;

    return (
        <Carousel sx={{ width: width }}>
            {items.map((item, i) => (
                <Item contain={contain} key={i} item={item} day={day} height={height} />
            ))}
        </Carousel>
    );
}

function Item(props) {
    const { item, height, contain, width, day } = props;
    const { name, subtitle, image, description } = item;
    const [isVacancy, setIsVacancy] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.item.image.includes("vacancies")) {
            setIsVacancy(true);
        } else if (props.item.image.includes("isos")) {
            setIsVacancy(true);
        } else if (props.item.image.includes("valentin")) {
            setIsVacancy(true);
        } else if (props.item.image.includes("evaluacion")) {
            setIsVacancy(true);
        } else if (props.item.image.includes("cuestionario")) {
            setIsVacancy(true);
        } else if (props.item.image.includes("youth-finances")) {
            setIsVacancy(true);
        } else if (props.item.image.includes("water-webpage")) {
            setIsVacancy(true);
        } else if (props.item.image.includes("trivia")) {
            setIsVacancy(true);
        }
    }, []);

    const handleClickOpen = () => {
        if (isVacancy && props.item.image.includes("isos")) {
            navigate("/logged/blog/article/6");
        } else if (isVacancy && props.item.image.includes("valentin")) {
            navigate("/logged/valentin");
        } else if (isVacancy && props.item.image.includes("evaluacion")) {
            navigate("/logged/autoevaluacion");
        } else if (isVacancy && props.item.image.includes("cuestionario")) {
            window.open("https://forms.office.com/r/Lx5TKvZrqq?origin=lprLink");
        } else if (isVacancy && props.item.image.includes("youth-finances")) {
            navigate("/logged/blog/article/8");
        } else if (isVacancy && props.item.image.includes("water-webpage")) {
            window.open(
                "https://www.acueducto.com.co/wps/portal/EAB2/Home/inicio/!ut/p/z1/hY5BC4JAEIV_iwevzrRLYt22DoJEshJkewm1TQ11ZV3177fQKdjowRzmzfeGBwJyEEOxtHVhWjUUnd1vIryH_IibCMkZeYbI-S6lMb2QOKFw_QcIe8YfYmjzwoEwPGTkQBHjlDiBrx8JiLpT5acuG0oa1SC0fEotdTBrazfGjNPeRx_XdQ2KapaPuTIqqFRvx0dXsFGTgdzFw9jn-Np2y4l53hvtB_OW/dz/d5/L2dBISEvZ0FBIS9nQSEh/"
            );
        } else if (isVacancy && props.item.image.includes("trivia")) {
            navigate("/logged/trivia");
        } else if (isVacancy) {
            navigate("/logged/vacancies/");
        }
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
                    {subtitle}
                </Typography>
                <Typography variant="body">{description}</Typography>
            </Box>
        </>
    );
}

export default CarouselComponent;
