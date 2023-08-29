import React, { useEffect } from "react";
import CarouselComponent from "../components/Carousel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography, Box } from "@mui/material";
import imageExample from "../images/example-image.jpg";
import imageExample2 from "../images/example-image2.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import { useInView } from "react-intersection-observer";
import Grow from "@mui/material/Grow";

const Home = () => {
    const homeImages = [
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
    ];

    const birthdays = [
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true", name: "Ejemplo Name", description: "Gerencia Ejemplo" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true", name: "Ejemplo Name", description: "Gerencia Ejemplo" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true", name: "Ejemplo Name", description: "Gerencia Ejemplo" },
    ];

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    return (
        <>
            <Box sx={{ mt: "4rem" }}>
                <CarouselComponent items={homeImages} name={"Hola"} description={"Hola"} height={"80vh"} widht={"100%"} />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                    padding: "1em",
                    fontWeight: 500,
                    fontSize: "16px",
                }}
            >
                <Typography
                    color="primary"
                    id="section1"
                    sx={{ display: "flex", width: "100%", justifyContent: "center", pt: "1em", fontWeight: 500, fontSize: "30px", fontFamily: "Poppins" }}
                >
                    Cumpleaños
                </Typography>
                <Typography sx={{ color: "gray", display: "flex", width: "50%", justifyContent: "center", padding: "1em", fontWeight: 500, fontSize: "16px" }}>
                    ¡Celebremos juntos los destellos de vida que iluminan nuestro camino laboral! 🎉🌟 En esta sección, honramos a quienes hacen que cada día en la
                    empresa sea especial. ¡Feliz cumpleaños a nuestros brillantes compañeros que llenan nuestros días de alegría y éxito! 🎂🎈
                </Typography>
            </Box>
            <Grow in={inView}>
                <Box ref={ref} sx={{ display: "flex", width: "100%", justifyContent: "center", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <Card sx={{ maxWidth: 250, width: 250, height: 450 }}>
                        <CarouselComponent items={birthdays} day={"Ayer"} height={"280px"} widht={"100%"} />
                    </Card>{" "}
                    <Card sx={{ maxWidth: 350, width: 350, height: 450 }}>
                        <CarouselComponent items={birthdays} day={"Hoy"} height={"280px"} widht={"100%"} />
                    </Card>{" "}
                    <Card sx={{ maxWidth: 250, width: 250, height: 450 }}>
                        <CarouselComponent items={birthdays} day={"Mañana"} height={"280px"} widht={"100%"} />
                    </Card>{" "}
                </Box>
            </Grow>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: "2rem", gap: "2rem" }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "2rem" }}>
                    <Typography
                        color="primary"
                        id="section1"
                        sx={{ display: "flex", width: "100%", justifyContent: "center", pt: "1em", fontWeight: 500, fontSize: "30px", fontFamily: "Poppins" }}
                    >
                        Vacantes
                    </Typography>
                    <CarouselComponent items={homeImages} height={"80vh"} width={"100%"} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "2rem" }}>
                    <Typography
                        color="primary"
                        id="section1"
                        sx={{ display: "flex", width: "100%", justifyContent: "center", pt: "1em", fontWeight: 500, fontSize: "30px", fontFamily: "Poppins" }}
                    >
                        Beneficios
                    </Typography>
                    <CarouselComponent items={homeImages} height={"80vh"} width={"100%"} />
                </Box>
            </Box>
        </>
    );
};

export default Home;
