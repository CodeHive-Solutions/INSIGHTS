import React, { useEffect, useState } from "react";
import CarouselComponent from "../shared/Carousel";
import Card from "@mui/material/Card";
import { Typography, Box } from "@mui/material";
import { useInView } from "react-intersection-observer";
import Grow from "@mui/material/Grow";
import SnackbarAlert from "../common/SnackBarAlert";
import { getApiUrl } from "../../assets/getApi.js";
import Avatar from "../../images/home-carousel/avatar.jpg";
import { Container } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// media
import campaigns from "../../images/home-carousel/campaigns-1280-720.png";
import isos from "../../images/home-carousel/isos-1280-720.png";
import vacanciesCarousel from "../../images/home-carousel/vacancies-1280-720.png";
import realBenefit2 from "../../images/benefits/benefit-1.png";
import video from "../../videos/futbol.mp4";
import raac from "../../images/home-carousel/raac-1280-720.png";
import noBirthday from "../../images/birthdays/no-birthdays.png";
import noBirthday2 from "../../images/birthdays/no-birthdays-2.jpg";
import cake from "../../images/birthdays/cake.png";
import chiguiro from "../../images/home-carousel/chiguiro.png";

const benefits = [{ image: realBenefit2, title: "Beneficio 2" }];
const homeImages = [{ image: raac }, { image: campaigns }, { image: isos }, { image: vacanciesCarousel }, { image: chiguiro }];
const Home = () => {
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [todayBirthdays, setTodayBirthdays] = useState([]);
    const [yesterdayBirthdays, setYesterdayBirthdays] = useState([]);
    const [tomorrowBirthdays, setTomorrowBirthdays] = useState([]);
    const matches = useMediaQuery("(min-width:1025px)");

    const handleCloseSnack = () => setOpenSnack(false);

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
                        subtitle: employee.campana_general,
                        description: employee.descripcion,
                    };
                }

                // If image not found, return null
                return {
                    image: Avatar,
                    name: formattedName,
                    subtitle: employee.campana_general,
                    description: employee.descripcion,
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
            <Box sx={{ display: "flex", mt: "5.5rem", px: "2rem", textAlign: "center", justifyContent: "center" }}>
                <CarouselComponent items={homeImages} contain={true} height={matches ? "648px" : "480px"} width={matches ? "1152px" : "854px"} />
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
                    En C&C respaldamos con entusiasmo el deporte y en particular el fútbol femenino. A través de nuestro patrocinio, hemos contribuido al éxito de nuestro
                    equipo Future Soccer, que recientemente se destacó al ganar el torneo de la copa Nottingham. Este logro no solo refuerza nuestro compromiso con la
                    comunidad, sino que también subraya nuestro apoyo a la equidad de género en el deporte. Estamos emocionados de seguir respaldando y empoderando a
                    nuestras talentosas atletas mientras continúan alcanzando nuevas metas.
                    <br /> ¡En C&C Services creemos en el poder transformador del deporte para construir un futuro más sólido y unido!
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
                    ¡Feliz cumpleaños a nuestros queridos colaboradores que nos llenan de alegría y éxito! 🎉🎂{" "}
                </Typography>
            </Box>
            <Grow in={inView}>
                <Box ref={ref} sx={{ display: "flex", width: "100%", justifyContent: "center", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <Card sx={{ maxWidth: 350, width: 350, height: 700 }}>
                        {yesterdayBirthdays.length === 0 ? (
                            <>
                                <img src={cake}></img>
                                <Box
                                    sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "50%" }}
                                >
                                    <Typography variant="h6" color="gray">
                                        Ayer no hubo cumpleaños
                                    </Typography>
                                    <Typography variant="body" color="gray">
                                        ¡Pero siempre hay espacio para una sonrisa!
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            <CarouselComponent items={yesterdayBirthdays} day={"Ayer"} height={"280px"} width={"100%"} />
                        )}
                    </Card>
                    <Card sx={{ maxWidth: 350, width: 350, height: 700 }}>
                        {todayBirthdays.length === 0 ? (
                            <>
                                <img src={cake}></img>
                                <Box
                                    sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "50%" }}
                                >
                                    <Typography variant="h6" color="gray">
                                        Hoy no hay cumpleaños
                                    </Typography>
                                    <Typography variant="body" color="gray">
                                        ¡Pero siempre hay espacio para una sonrisa!
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            <CarouselComponent items={todayBirthdays} day={"Hoy"} height={"280px"} width={"100%"} />
                        )}
                    </Card>{" "}
                    <Card sx={{ maxWidth: 350, width: 350, height: 700 }}>
                        {tomorrowBirthdays.length === 0 ? (
                            <>
                                <img src={cake}></img>
                                <Box
                                    sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "50%" }}
                                >
                                    <Typography variant="h6" color="gray">
                                        Mañana no hay cumpleaños
                                    </Typography>
                                    <Typography variant="body" color="gray">
                                        ¡Pero siempre hay espacio para una sonrisa!
                                    </Typography>
                                </Box>
                            </>
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
                    <CarouselComponent items={benefits} height={"960px"} width={"540px"} />
                </Box>
            </Box>
            <SnackbarAlert message={message} severity={severity} openSnack={openSnack} closeSnack={handleCloseSnack} />
        </>
    );
};

export default Home;
