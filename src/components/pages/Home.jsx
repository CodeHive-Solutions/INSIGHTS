import React, { useEffect, useState } from "react";
import CarouselComponent from "../shared/Carousel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography, Box, Dialog } from "@mui/material";
import { motion, useIsPresent } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Grow from "@mui/material/Grow";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import quality from "../../images/quality/quality.jpg";
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi.js";
//images carousel test
import imageTest from "../../images/home-carousel/image00001.jpg";
import imageTest1 from "../../images/home-carousel/image00002.jpeg";
import imageTest2 from "../../images/home-carousel/image00003.jpeg";
import imageTest3 from "../../images/home-carousel/image00004.jpeg";
import imageTest4 from "../../images/home-carousel/image00006.jpeg";
import realImage from "../../images/home-carousel/2.jpg";
import realImage2 from "../../images/home-carousel/3.jpg";
import realImage3 from "../../images/home-carousel/4.jpg";

// images
import barbaraVanegas from "../../images/birthdays/barbara-vanegas.jpeg";
import cristianGonzales from "../../images/birthdays/cristian-gonzales.jpeg";
import tuliaCalderon from "../../images/birthdays/tulia-calderon.jpeg";
import carolGuerrero from "../../images/birthdays/carol-guerrero.jpeg";
import benefit1 from "../../images/benefits-vacancies/MicrosoftTeams-image4.png";
import benefit2 from "../../images/benefits-vacancies/MicrosoftTeams-image5.png";
import benefit3 from "../../images/benefits-vacancies/MicrosoftTeams-image6.png";
import benefit4 from "../../images/benefits-vacancies/MicrosoftTeams-image7.png";

//vacancies
import vancie1 from "../../images/vacancies/1.jpg";
import vancie2 from "../../images/vacancies/2.jpg";
import vancie3 from "../../images/vacancies/3.png";
import vancie4 from "../../images/vacancies/4.jpg";

//benefits
import realBenefit1 from "../../images/benefits/1.png";
import realBenefit2 from "../../images/benefits/2.png";
import { RepeatOneSharp } from "@mui/icons-material";

const benefits = [
    { image: realBenefit1, title: "Beneficio 1" },
    { image: realBenefit2, title: "Beneficio 2" },
];

const vacancies = [
    // { image: benefit3, title: "Vacante 1" },
    // { image: benefit4, title: "Vacante 2" },
    { image: realBenefit1, title: "Beneficio 1" },
    { image: realBenefit2, title: "Beneficio 2" },
];

const homeImages = [{ image: realImage }, { image: realImage2 }, { image: realImage3 }];
const birthdays = [
    { image: barbaraVanegas, name: "nombre ejemplo", description: "Yanbal" },
    { image: carolGuerrero, name: "nombre ejemplo", description: "Scotiabank Colpatria" },
    { image: tuliaCalderon, name: "nombre ejemplo", description: "Yanbal" },
    { image: cristianGonzales, name: "nombre ejemplo", description: "BBVA" },
];
const birthdays2 = [
    { image: cristianGonzales, name: "nombre ejemplo", description: "Yanbal" },
    { image: barbaraVanegas, name: "nombre ejemplo", description: "BBVA" },
    { image: carolGuerrero, name: "nombre ejemplo", description: "Yanbal" },
    { image: tuliaCalderon, name: "nombre ejemplo", description: "Scotiabank Colpatria" },
];

const birthdays3 = [
    { image: carolGuerrero, name: "nombre ejemplo", description: "Scotiabank Colpatria" },
    { image: cristianGonzales, name: "nombre ejemplo", description: "Yanbal" },
    { image: barbaraVanegas, name: "nombre ejemplo", description: "BBVA" },
    { image: tuliaCalderon, name: "nombre ejemplo", description: "Yanbal" },
];

const Home = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => setOpenDialog(true);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const handleCloseSnack = () => setOpenSnack(false);
    const [todayBirthdays, setTodayBirthdays] = useState([]);
    const [yesterdayBirthdays, setYesterdayBirthdays] = useState([]);
    const [tomorrowBirthdays, setTomorrowBirthdays] = useState([]);

    const showSnack = (severity, message, error) => {
        setSeverity(severity);
        setMessage(message);
        setOpenSnack(true);
        if (error) {
            console.error("error:", message);
        }
    };

    const fetchImages = async (employees) => {
        const imagePromises = employees.map(async (employee) => {
            try {
                const imageResponse = await fetch(`https://staffnet-api-dev.cyc-bpo.com/profile-picture/${employee.cedula}`, {
                    method: "GET",
                });

                // Check if the image is found (status 200) and return the image URL
                if (imageResponse.status === 200) {
                    return {
                        image: `https://staffnet-api-dev.cyc-bpo.com/profile-picture/${employee.cedula}`,
                    };
                }
                // If image not found, return null
                return null;
            } catch (error) {
                return null; // Handle fetch errors by returning null
            }
        });

        return (await Promise.all(imagePromises)).filter((image) => image !== null);
    };

    const getBirthdaysId = async () => {
        try {
            const response = await fetch("https://staffnet-api-dev.cyc-bpo.com/profile-picture/birthday", {
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail);
            }

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
            showSnack("error", error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        getBirthdaysId();
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
            {/* <Box
                className="waveWrapper"
                sx={{
                    width: "100%",
                    height: "20vh",
                    backgroundSize: "cover",
                    backgroundColor: "#f0f0f0",
                    padding: "20px",
                }}
            >
                <Box className="wave wave1"></Box>
                <Box className="wave wave2"></Box>
                <Box className="wave wave3"></Box>
                <Box className="wave wave4"></Box>
            </Box> */}
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
                        <CarouselComponent items={yesterdayBirthdays} day={"Ayer"} height={"280px"} width={"100%"} />
                    </Card>{" "}
                    <Card sx={{ maxWidth: 350, width: 350, height: 450 }}>
                        <CarouselComponent items={todayBirthdays} day={"Hoy"} height={"280px"} width={"100%"} />
                    </Card>{" "}
                    <Card sx={{ maxWidth: 250, width: 250, height: 450 }}>
                        <CarouselComponent items={tomorrowBirthdays} day={"Mañana"} height={"280px"} width={"100%"} />
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
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Home;
