import React, { useEffect, useState } from "react";
import CarouselComponent from "../shared/Carousel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography, Box, Dialog } from "@mui/material";
import { motion, useIsPresent } from "framer-motion";
import imageExample from "../../images/example-image.jpg";
import imageExample2 from "../../images/example-image2.jpg";
import { useInView } from "react-intersection-observer";
import Grow from "@mui/material/Grow";
import "../../index.css";
import { useNavigate } from "react-router-dom";

//images test
import imageTest from "../../images/carousel-test.jpg";
import imageTest1 from "../../images/test/image00002.jpeg";
import imageTest2 from "../../images/test/image00003.jpeg";
import imageTest3 from "../../images/test/image00004.jpeg";

// images
import barbaraVanegas from "../../images/birthdays/barbara-vanegas.jpeg";
import cristianGonzales from "../../images/birthdays/cristian-gonzales.jpeg";
import tuliaCalderon from "../../images/birthdays/tulia-calderon.jpeg";
import carolGuerrero from "../../images/birthdays/carol-guerrero.jpeg";
import benefit1 from "../../images/benefits-vacancies/MicrosoftTeams-image4.png";
import benefit2 from "../../images/benefits-vacancies/MicrosoftTeams-image5.png";
import benefit3 from "../../images/benefits-vacancies/MicrosoftTeams-image6.png";
import benefit4 from "../../images/benefits-vacancies/MicrosoftTeams-image7.png";

const benefits = [
    { image: benefit1, title: "Beneficio 1" },
    { image: benefit2, title: "Beneficio 2" },
];

const vacancies = [
    { image: benefit3, title: "Vacante 1" },
    { image: benefit4, title: "Vacante 2" },
];

const homeImages = [{ image: imageTest }, { image: imageTest1 }, { image: imageTest2 }, { image: imageTest3 }];
const birthdays = [
    { image: barbaraVanegas, name: "Barbara Vanegas", description: "Yanbal" },
    { image: cristianGonzales, name: "Cristian Gonzales", description: "Scotiabank Colpatria" },
    { image: tuliaCalderon, name: "Tulia Calderon", description: "Yanbal" },
    { image: carolGuerrero, name: "Carol Guerrero", description: "BBVA" },
];
const birthdays2 = [
    { image: tuliaCalderon, name: "Tulia Calderon", description: "Yanbal" },
    { image: carolGuerrero, name: "Carol Guerrero", description: "BBVA" },
    { image: barbaraVanegas, name: "Barbara Vanegas", description: "Yanbal" },
    { image: cristianGonzales, name: "Cristian Gonzales", description: "Scotiabank Colpatria" },
];

const birthdays3 = [
    { image: cristianGonzales, name: "Cristian Gonzales", description: "Scotiabank Colpatria" },
    { image: barbaraVanegas, name: "Barbara Vanegas", description: "Yanbal" },
    { image: carolGuerrero, name: "Carol Guerrero", description: "BBVA" },
    { image: tuliaCalderon, name: "Tulia Calderon", description: "Yanbal" },
];

const Home = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => setOpenDialog(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isPresent = useIsPresent();

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    return (
        <>
            {/* <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
                exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
                style={{ originX: isPresent ? 0 : 1 }}
                className="privacy-screen"
            /> */}
            <Box sx={{ display: "flex", mt: "4rem", textAlign: "center", justifyContent: "center" }}>
                <CarouselComponent items={homeImages} name={"Hola"} description={"Hola"} height={"80vh"} width={"100%"} />
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
                    `¡Feliz cumpleaños a nuestros brillantes compañeros que llenan nuestros días de alegría y éxito! 🎂🎈`
                </Typography>
            </Box>
            <Grow in={inView}>
                <Box ref={ref} sx={{ display: "flex", width: "100%", justifyContent: "center", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <Card sx={{ maxWidth: 250, width: 250, height: 450 }}>
                        <CarouselComponent items={birthdays} day={"Ayer"} height={"280px"} width={"100%"} />
                    </Card>{" "}
                    <Card sx={{ maxWidth: 350, width: 350, height: 450 }}>
                        <CarouselComponent items={birthdays2} day={"Hoy"} height={"280px"} width={"100%"} />
                    </Card>{" "}
                    <Card sx={{ maxWidth: 250, width: 250, height: 450 }}>
                        <CarouselComponent items={birthdays3} day={"Mañana"} height={"280px"} width={"100%"} />
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
                    <CarouselComponent items={vacancies} height={"80vh"} width={"100%"} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "2rem" }}>
                    <Typography
                        color="primary"
                        id="section1"
                        sx={{ display: "flex", width: "100%", justifyContent: "center", pt: "1em", fontWeight: 500, fontSize: "30px", fontFamily: "Poppins" }}
                    >
                        Beneficios
                    </Typography>
                    <CarouselComponent items={benefits} height={"80vh"} width={"100%"} />
                </Box>
            </Box>
            <Dialog open={openDialog} title={"example title"}>
                <p>HOLA</p>
            </Dialog>
            <button onClick={handleOpenDialog}>open</button>
        </>
    );
};

export default Home;
