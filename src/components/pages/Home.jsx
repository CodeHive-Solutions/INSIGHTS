import React, { useEffect, useState, useRef } from "react";
import CarouselComponent from "../shared/Carousel";
import Card from "@mui/material/Card";
import { Typography, Box, Dialog } from "@mui/material";
import { motion, useIsPresent } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Grow from "@mui/material/Grow";
import "../../index.css";
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi.js";
import Avatar from "../../images/home-carousel/avatar.jpg";
import Blog from "./Blog.jsx";
import { Container } from "@mui/material";

// images
import raac from "../../images/home-carousel/racc-1280-720.png";
import campaigns from "../../images/home-carousel/campaigns-1280-720.png";
import isos from "../../images/home-carousel/isos-1280-720.png";
import vacanciesCarousel from "../../images/home-carousel/vacancies-1280-720.png";
import image1280x720 from "../../images/home-carousel/1280-720.jpg";
//benefits
import realBenefit2 from "../../images/benefits/2.png";
import asesorComercialVacante from "../../images/vacancies/asesor-comercial-vacante.png";
import asesorNegociacionVacante from "../../images/vacancies/asesor-negociacion-vacante.png";
import video from "../../videos/futbol.mp4";
const benefits = [{ image: realBenefit2, title: "Beneficio 2" }];

const vacancies = [
    { image: raac, title: "Beneficio 1" },
    { image: asesorComercialVacante, title: "Beneficio 2" },
    { image: asesorNegociacionVacante, title: "Beneficio 3" },
];

const homeImages = [
    { image: raac },
    { image: campaigns },
    { image: isos },
    { image: vacanciesCarousel },
    { image: image1280x720 },
    // { image: video, video: true },
];

const Home = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [todayBirthdays, setTodayBirthdays] = useState([]);
    const [yesterdayBirthdays, setYesterdayBirthdays] = useState([]);
    const [tomorrowBirthdays, setTomorrowBirthdays] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handleCloseSnack = () => setOpenSnack(false);
    const handleOpenDialog = () => setOpenDialog(true);

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

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
                const imageResponse = await fetch(`${getApiUrl(true)}profile-picture/${employee.cedula}`, {
                    method: "GET",
                });

                const fullName = employee.nombre;

                // Split the full name into individual names and last names
                const nameParts = fullName.split(" ");

                // Extract the first name
                const firstName = nameParts.length === 2 ? nameParts[1] : nameParts.length > 2 ? nameParts[2] : "";

                // Extract the first last name (if exists)
                const firstLastName = nameParts.length > 0 ? nameParts[0] : "";

                // Create the formatted name
                const formattedName = `${firstName} ${firstLastName}`.trim();

                // Check if the image is found (status 200) and return the image URL
                if (imageResponse.status === 200) {
                    return {
                        image: `${getApiUrl(true)}profile-picture/${employee.cedula}`,
                        name: formattedName,
                        description: employee.campana_general,
                    };
                }

                // If image not found, return null
                return {
                    image: Avatar,
                    name: formattedName,
                    description: employee.campana_general,
                };
            } catch (error) {
                return null; // Handle fetch errors by returning null
            }
        });

        return (await Promise.all(imagePromises)).filter((image) => image !== null);
    };

    const getBirthdaysId = async () => {
        try {
            const response = await fetch(`${getApiUrl(true)}profile-picture/birthday`, {
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    return;
                }
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
            console.error(error);
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

    const noBirthdays = (message) => {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Typography
                    sx={{
                        color: "gray",
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        fontWeight: 500,
                        fontSize: "16px",
                        textAlign: "center",
                    }}
                >
                    {message}
                </Typography>
            </Box>
        );
    };

    return (
        <>
            {/* <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
                exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
                style={{ originX: isPresent ? 0 : 1 }}
                className="privacy-screen"
            /> */}
            <Box sx={{ display: "flex", mt: "5.5rem", px: "2rem", textAlign: "center", justifyContent: "center" }}>
                <CarouselComponent items={homeImages} contain={true} height={"648px"} width={"1152px"} />
            </Box>
            <Container sx={{ display: "flex", flexDirection: "column", gap: "2rem", mt: "2rem" }}>
                <Typography
                    color="primary"
                    id="section1"
                    sx={{ display: "flex", width: "100%", justifyContent: "center", pt: "1em", fontWeight: 500, fontSize: "30px", fontFamily: "Poppins" }}
                >
                    ¡C&C Apoyando el deporte!
                </Typography>
                <Typography sx={{ color: "gray", textAlign: "center" }}>
                    En C&C Services S.A.S, respaldamos con entusiasmo el deporte y, en particular, el fútbol femenino. A través de nuestro patrocinio, hemos contribuido
                    al éxito de nuestro equipo, que recientemente se destacó al ganar un torneo destacado. Este logro no solo refuerza nuestro compromiso con la
                    comunidad, sino que también subraya nuestro apoyo a la equidad de género en el deporte. Estamos emocionados de seguir respaldando y empoderando a
                    nuestras talentosas atletas mientras continúan alcanzando nuevas metas. ¡En C&C Services S.A.S, creemos en el poder transformador del deporte para
                    construir un futuro más sólido y unido!
                </Typography>
                <Box display={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <video style={{ borderRadius: "8px", width: "100%" }} controls>
                        <source src={video} type="video/mp4" />
                    </video>
                </Box>
            </Container>
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
                    ¡Feliz cumpleaños a nuestros brillantes compañeros que llenan nuestros días de alegría y éxito! 🎂🎈
                </Typography>
            </Box>
            <Grow in={inView}>
                <Box ref={ref} sx={{ display: "flex", width: "100%", justifyContent: "center", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <Card sx={{ maxWidth: 350, width: 350, height: 450 }}>
                        {yesterdayBirthdays.length === 0 ? (
                            noBirthdays("No hubo cumpleaños ayer")
                        ) : (
                            <CarouselComponent items={yesterdayBirthdays} description={yesterdayBirthdays.nombre} day={"Ayer"} height={"280px"} width={"100%"} />
                        )}
                    </Card>
                    <Card sx={{ maxWidth: 350, width: 350, height: 450 }}>
                        {todayBirthdays.length === 0 ? (
                            noBirthdays("No hay cumpleaños hoy")
                        ) : (
                            <CarouselComponent items={todayBirthdays} description={todayBirthdays.nombre} day={"Hoy"} height={"280px"} width={"100%"} />
                        )}
                    </Card>{" "}
                    <Card sx={{ maxWidth: 350, width: 350, height: 450 }}>
                        {tomorrowBirthdays.length === 0 ? (
                            noBirthdays("No hay cumpleaños mañana")
                        ) : (
                            <CarouselComponent items={tomorrowBirthdays} day={"Mañana"} height={"280px"} width={"100%"} />
                        )}
                    </Card>{" "}
                </Box>
            </Grow>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: "2rem", gap: "2rem", flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <Typography
                        color="primary"
                        id="section1"
                        sx={{ display: "flex", width: "100%", justifyContent: "center", pt: "1em", fontWeight: 500, fontSize: "30px", fontFamily: "Poppins" }}
                    >
                        Beneficios
                    </Typography>
                    <CarouselComponent items={benefits} height={"650px"} width={"600px"} />
                </Box>
            </Box>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Home;
