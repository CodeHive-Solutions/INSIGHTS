import { React, useEffect } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import cycLogo from "../images/img-about.jpg";
import CarouselComponent from "../components/Carousel";
import { useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
import image1 from "../images/image-vision.jpg";
import image2 from "../images/image-mision.png";
import image3 from "../images/image-values.jpg";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import logoTipo from "../images/logotipo.png";
import cesarGarzon from "../images/managers/cesar-garzon.jpg";
import javierTorres from "../images/managers/javier-torres.jpeg";
import mariaFerrucho from "../images/managers/maria-ferrucho.jpg";
import angelaDuran from "../images/managers/angela-duran.jpeg";
import adrianaPaez from "../images/managers/adriana-paez.jpg";
import diegoGonzales from "../images/managers/diego-gonzales.jpg";
import marioGiron from "../images/managers/mario-giron.jpg";
import melidaSandoval from "../images/managers/melida-sandoval.jpg";
import hectorSotelo from "../images/managers/hector-sotelo.png";

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const homeImages = [
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
    ];

    const managements = [
        { name: "Cesar Garzon", management: "Gerente General", image: cesarGarzon },
        { name: "Javier Torres", management: "Gerente de Tecnología", image: javierTorres },
        { name: "Maria Ferrucho ", management: "Gerente de Gestión Humana", image: mariaFerrucho },
        { name: "Angela Duran", management: "Gerente de Planeación", image: angelaDuran },
        { name: "Adriana Paez", management: "Gerente de Operaciones", image: adrianaPaez },
        { name: "Hector Sotelo", management: "Gerente de Operaciones de Ventas", image: hectorSotelo },
        { name: "Diego Gonzales", management: "Gerente de Legal y Riesgo", image: diegoGonzales },
        {
            name: "Mario Giron",
            management: "Gerente de Riesgo y Control Interno",
            image: marioGiron,
        },
        { name: " Melida Sandoval", management: "Gerente Administrativa", image: melidaSandoval },
    ];

    const isSmallScreen = useMediaQuery("(max-width:600px)");

    return (
        <Box sx={{ display: "flex", gap: "5rem", flexDirection: "column", width: "100%", marginTop: "6rem" }}>
            <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins" }}>
                Sobre Nosotros
            </Typography>
            <Box sx={{ display: "flex", gap: "2rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <Box>{isSmallScreen ? <img width={300} src={cycLogo} alt="" /> : <img width={500} src={cycLogo} alt="" />}</Box>
                <Box sx={{ width: "35rem" }}>
                    <Typography sx={{ color: "gray" }}>
                        C&C Services S.A.S., desde 2005, ofrece soluciones para fortalecer los ciclos de riesgo de las empresas a través de un modelo de gestión BPO
                        innovador y eficiente. Con tres líneas de negocio: Services, Risk y Legal, cubrimos los procesos de creación, mantenimiento y recuperación de
                        clientes. Nos caracterizamos por estrictos controles, autoevaluación constante, alta efectividad y tecnología avanzada, todo con el objetivo de
                        abrir nuevas posibilidades en el mercado.
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "55px",
                    fontStyle: "italic",
                }}
            >
                <Typography
                    color="primary"
                    sx={{
                        borderTop: "2px solid ",
                        borderBottom: "2px solid ",
                        fontSize: "55px",
                        fontStyle: "italic",
                        fontFamily: "Poppins",
                    }}
                >
                    we will win{" "}
                </Typography>
            </Box>

            <Container
                disableGutters
                maxWidth={false}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "3rem",
                    flexWrap: "wrap",
                    py: "2rem",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center", pl: "12rem" }}>
                    <Box sx={{ width: "30%" }}>
                        <Typography color="primary" sx={{ fontFamily: "Poppins", fontSize: "40px", fontWeight: "500" }} variant="h5" component="div">
                            Nuestra Visión
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "16px", color: "gray" }}>
                            En el 2025 seremos una compañía líder en la industria de los Contact Center y BPO, caracterizándonos por un portafolio integral de servicios,
                            certificados con altos estándares de calidad, soportados en tecnología de punta y cobertura internacional.
                        </Typography>
                    </Box>
                    <img src={image1} height={400} alt="" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", pr: "12rem", gap: "2rem" }}>
                    <img src={image2} height={400} alt="" />
                    <Box sx={{ width: "30%" }}>
                        <Typography color="primary" sx={{ fontFamily: "Poppins", fontSize: "40px", fontWeight: "500" }} variant="h5" component="div">
                            Nuestra Misión
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "16px", color: "gray" }}>
                            Prestar servicios de Contact Center y BPO de alta calidad con un talento humano que genere valor a nuestros clientes, basados en prácticas
                            innovadoras, experiencia, solidez en el mercado, buscando un desarrollo responsable que impacte positivamente a la sociedad.
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center", pl: "12rem" }}>
                    <Box sx={{ width: "30%" }}>
                        <Typography color="primary" sx={{ fontFamily: "Poppins", fontSize: "40px", fontWeight: "500" }} variant="h5" component="div">
                            Nuestros Valores Corporativos
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "16px", color: "gray" }}>
                            La empresa se compromete a actuar con integridad, respeto, transparencia, responsabilidad y disciplina, tratando a todos con calidez humana y
                            pasión por la excelencia en el servicio. Además, valora la equidad y la igualdad de todas las personas, sin importar su raza, género, edad o
                            cultura.
                        </Typography>
                    </Box>
                    <img src={image3} height={400} alt="" />
                </Box>
            </Container>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins" }}>
                    Nuestras Sedes
                </Typography>
                <Box sx={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                    <CarouselComponent items={homeImages} height={"80vh"} width={"20rem"} />
                    <CarouselComponent items={homeImages} height={"80vh"} width={"20rem"} />
                    <CarouselComponent items={homeImages} height={"80vh"} width={"20rem"} />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", px: "8rem" }}>
                <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins" }}>
                    Organigrama de la empresa
                </Typography>
                <Box sx={{ borderRadius: "2rem", width: "100%", height: "40rem", border: "1px solid rgba(0, 0, 0, 0.12)" }}>
                    {isSmallScreen ? (
                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                color: "gray",
                                fontFamily: "Poppins",
                            }}
                        >
                            Imagen Organigrama
                        </Typography>
                    ) : (
                        <Typography
                            sx={{ fontSize: "4rem", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", height: "100%", color: "gray" }}
                        >
                            Imagen Organigrama
                        </Typography>
                    )}
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins", py: "2rem" }}>
                    Nuestras Gerencias
                </Typography>
                <Box sx={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                    {managements.map((item, index) => (
                        <Card
                            variant="outlined"
                            key={index}
                            sx={{
                                maxWidth: 350,
                                width: 350,
                                height: 450,
                                position: "relative",
                                overflow: "hidden",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                    backgroundImage: `url(${logoTipo})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    opacity: 0, // adjust this value to change the opacity
                                },
                            }}
                        >
                            <CardMedia sx={{ height: 350 }} image={item.image} />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    {item.management}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default AboutUs;
