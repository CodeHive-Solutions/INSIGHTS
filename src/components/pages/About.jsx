import { React, useEffect } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
import image1 from "../../images/about/image-vision.jpg";
import image2 from "../../images/about/image-mision.png";
import image3 from "../../images/about/image-values.jpg";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import cesarGarzon from "../../images/managers/cesar-garzon.jpg";
import javierTorres from "../../images/managers/javier-torres.jpeg";
import yannethPinzon from "../../images/managers/yanneth-pinzon.webp";
import angelaDuran from "../../images/managers/angela-duran.jpeg";
import adrianaPaez from "../../images/managers/adriana-paez.jpg";
import diegoGonzales from "../../images/managers/diego-gonzales.jpg";
import marioGiron from "../../images/managers/mario-giron.jpg";
import melidaSandoval from "../../images/managers/melida-sandoval.jpg";
import hectorSotelo from "../../images/managers/hector-sotelo.png";
import pablo from "../../images/managers/pablo.jpeg";
import aboutUs from "../../images/about/img-about-2.jpg";
import organigrama from "../../images/about/organigrama.jpg";

//mission images
import mission1 from "../../images/about/image-mission.jpg";
import mission2 from "../../images/about/image-mission-2.jpg";
import mission3 from "../../images/about/image-mission-3.jpg";
import mission4 from "../../images/about/image-mission-4.jpg";

//corporative values images
import value1 from "../../images/about/corporative-values.jpg";

const homeImages = [
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
];

const managements = [
    {
        name: "Cesar Garzón",
        management: "Gerente General",
        image: cesarGarzon,
        description:
            "Garantizar la sostenibilidad de la compañía a través de la planeación, liderazgo y control de las diferentes áreas que permitan alcanzar los objetivos establecidos con los clientes, el recurso humano y los accionistas.",
    },
    {
        name: "Diego González",
        management: "Gerente de Legal y Riesgo",
        image: diegoGonzales,
        description:
            "LEGAL: Prestar asesorías y representación judicial de los clientes internos y externos. \n \nRIESGO: Ejecutar procesos de Investigación y análisis mediante la implementación y desarrollo de estrategias que garanticen la mitigación del riesgo.",
    },
    {
        name: "Angela Duran",
        management: "Gerente de Planeación",
        image: angelaDuran,
        description:
            "Planificar, coordinar, dirigir y controlar las actividades que impactan el óptimo funcionamiento de la organización, garantizando un cumplimiento de los procesos establecidos con los más altos estándares de calidad.",
    },
    {
        name: "Adriana Páez",
        management: "Gerente de Operaciones",
        image: adrianaPaez,
        description:
            "Liderar, planificar y controlar las operaciones de las campañas de Cobranzas, con equipos productivos y con alta calidad que garanticen los resultados frente a los clientes y la rentabilidad de cada una de ellas.",
    },
    {
        name: "Hector Sotelo",
        management: "Gerente de Operaciones de Ventas",
        image: hectorSotelo,
        description:
            "Liderar, planificar y controlar las operaciones de las campañas de Cobranzas, con equipos productivos y con alta calidad que garanticen los resultados frente a los clientes y la rentabilidad de cada una de ellas.",
    },
    {
        name: "Jeanneth Pinzón ",
        management: "Gerente de Gestión Humana",
        image: yannethPinzon,
        description:
            "Proveer, mantener y desarrollar un recurso humano altamente calificado y motivado para alcanzar los objetivos de la organización a través de la aplicación de programas enfocados en conectar al Talento Humano con el propósito de la compañía desde sus habilidades, motivaciones, conocimientos y pasiones, para así apalancar efectivamente el éxito de los objetivos del negocio y a su vez velar por el cumplimiento de las normas y procedimientos vigentes",
    },
    {
        name: "Mario Giron",
        management: "Gerente de Riesgo y Control Interno",
        image: marioGiron,
        description: `Resguardar los recursos de la empresa para evitar pérdidas o faltas que puedan afectar su rentabilidad en un marco de gestión de riesgos, donde son identificados, evaluados y controlados, los cuales son informados, comunicados y monitoreados, mediante procesos de auditoría. \n \nAtender procesos de auditoria externas periódicamente de los clientes, entes certificadores, entes de control y firmas evaluadoras de riesgos.`,
    },
    {
        name: "Melida Sandoval",
        management: "Gerente Administrativa",
        image: melidaSandoval,
        description:
            "Planear, controlar las políticas de administración de recursos financieros, garantizando el abastecimiento oportuno de bienes y servicios que permiten el adecuado funcionamiento de la organización,  manteniendo un  adecuado relacionamiento con los bancos para asegurar la disponibilidad y el control de los recursos financieros de la compañía y controlando la causación contable de manera oportuna.",
    },
];

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const isSmallScreen = useMediaQuery("(max-width:600px)");

    return (
        <Box sx={{ display: "flex", gap: "5rem", flexDirection: "column", width: "100%", marginTop: "6rem" }}>
            <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins" }}>
                Sobre Nosotros
            </Typography>
            <Box sx={{ display: "flex", gap: "2rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <Box>
                    {isSmallScreen ? (
                        <img width={300} style={{ borderRadius: "8px" }} src={aboutUs} alt="" />
                    ) : (
                        <img style={{ borderRadius: "8px" }} width={500} src={aboutUs} alt="" />
                    )}
                </Box>
                <Box sx={{ width: "35rem" }}>
                    <Typography sx={{ color: "gray", textAlign: "justify" }}>
                        Somos una compañía con más de 18 años de experiencia en el mercado, especializada en ofrecer soluciones para fortalecer ciclos de riesgo;
                        proveemos alternativas para los procesos de originación, mantenimiento y recuperación de cartera. En la implementación de servicios BPO,
                        trabajamos con estándares metodológicos de calidad que nos permiten la optimización de procesos para garantizar resultados que maximicen la
                        rentabilidad de la operación de nuestros clientes y les facilite concentrarse en su core de negocio. Nos enfocamos en prestar servicios de Contact
                        Center y BPO de alta calidad con un talento humano que genere valor a nuestros clientes, basados en prácticas innovadoras, experiencia, solidez en
                        el mercado, buscando un desarrollo responsable que impacte positivamente a la sociedad.
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
                    gap: "5rem",
                    flexWrap: "wrap",
                    py: "2rem",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
                    <img style={{ borderRadius: 5 }} src={mission2} height={300} alt="" />
                    <Box sx={{ width: "550px" }}>
                        <Typography color="primary" sx={{ fontFamily: "Poppins", fontSize: "40px", fontWeight: "500" }} variant="h5" component="div">
                            Nuestra Misión
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "16px", color: "gray" }}>
                            Conectamos personas para transformar desafíos en soluciones.
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
                    <Box sx={{ width: "550px", textAlign: "justify" }}>
                        <Typography color="primary" sx={{ fontFamily: "Poppins", fontSize: "40px", fontWeight: "500" }} variant="h5" component="div">
                            Nuestra Visión
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "16px", color: "gray" }}>
                            Ofrecer un modelo de servicios que en el 2026 trascienda fronteras hacia los países de América Latina y España, a partir de la transformación
                            digital y el mejor talento humano.
                        </Typography>
                    </Box>
                    <img style={{ borderRadius: "8px" }} src={mission1} height={300} alt="" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
                    <img style={{ borderRadius: "8px" }} src={value1} height={300} alt="" />
                    <Box sx={{ width: "550px" }}>
                        <Typography color="primary" sx={{ fontFamily: "Poppins", fontSize: "40px", fontWeight: "500" }} variant="h5" component="div">
                            Nuestros Valores Corporativos
                        </Typography>

                        <Typography variant="body2" sx={{ fontSize: "16px", color: "gray" }}>
                            En C&C, los valores corporativos constituyen la columna vertebral de nuestra cultura y orientan cada faceta de la operación. Son el motor que
                            nos impulsa hacia adelante, permitiéndonos cumplir con las expectativas de clientes, empleados y comunidades, al tiempo que construimos un
                            futuro sostenible y exitoso.
                        </Typography>
                    </Box>
                </Box>
            </Container>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", px: "5rem" }}>
                <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins" }}>
                    Historia
                </Typography>
                <Box sx={{ display: "flex", gap: "2rem", justifyContent: "center", alignItems: "center" }}>
                    <Container fixed maxWidth="md">
                        <Typography sx={{ textAlign: "justify", color: "gray" }}>
                            Soy el fundador de C&C, desde muy joven soñaba con crear una empresa que pudiera impulsar el crecimiento económico de nuestro país y al mismo
                            tiempo crear empleos de calidad para la gente que compartiera esta visión. Mis amigos más cercanos me definen como una persona emprendedora y
                            visionaria. La idea inicial de nuestra compañía surgió cuando yo trabajaba en el área legal de un reconocido banco colombiano, en el cual, me
                            desempeñé en la gestión y administración de cartera jurídica, en ese rol jurídico, identifiqué rápidamente algunas necesidades insatisfechas
                            que en ese entonces tenían los deudores en asuntos como conciliaciones, acuerdos de pago, condonaciones, reestructuración de créditos, entre
                            otros, lo cual, les dificultaba sanear sus obligaciones y acceder a nuevas oportunidades de rebancarización.
                            <br />
                            <br />
                            Fue así como en septiembre de 2004, decidí iniciar este proyecto para ofrecer servicios de consultoría al sector financiero en gestión de
                            cobro y administración de cartera jurídica, poniendo a disposición del mercado mis años de experiencia y mis valores personales como la guía
                            inicial para consolidar una idea que poco a poco se transformaba en realidad.
                            <br />
                            <br />
                            Nuestro primer cliente fue el banco Davivienda, con ellos tuvimos la gran oportunidad de empezar nuestras operaciones en Bogotá, a raíz de las
                            necesidades del mercado nuestra compañía fue evolucionando en la prestación de servicios BPO y en el año 2005 consolidamos tres líneas de
                            negocio, legal, riesgo y servicios de Call Center y Contact Center; a partir de las cuales, hemos logrado un crecimiento sostenible basado en
                            valores como pasión, integridad, innovación, impacto social y excelencia.
                            <br />
                            <br />
                            Aunque empezamos con una línea muy marcada en gestión de cartera, hoy en día somos fuertes en televentas y servicio al cliente, contamos con
                            alrededor de 900 empleados, cuatro sedes a nivel nacional, prestamos servicios a cinco países de Latinoamérica y en nuestro portafolio actual
                            se cuentan más de 30 clientes B2B en sectores como bancario, salud, real, cooperativo, comunicaciones, seguros y Fintech.
                            <br />
                            <br />
                            Nuestra visión para el futuro está enfocada en la vanguardia tecnológica, la innovación, la expansión y el desarrollo integral de herramientas
                            que potencien los resultados de nuestros clientes.
                        </Typography>
                    </Container>
                </Box>{" "}
                <Box sx={{ textAlign: "center", mt: "2rem" }}>
                    <img style={{ borderRadius: "2rem" }} height={600} src={pablo} alt="pablo" />
                    <Typography sx={{ fontFamily: "Dancing Script", fontSize: "42px", textAlign: "center", justifyContent: "flex-end" }}>
                        Pablo Cesár Castañeda
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", px: "8rem" }}>
                <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins" }}>
                    Organigrama de la empresa
                </Typography>
                <img src={organigrama} alt="organigrama" width={"1400px"} />
                {/* <Box sx={{ borderRadius: "2rem", width: "100%", height: "40rem", border: "1px solid rgba(0, 0, 0, 0.12)" }}>
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
                </Box> */}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins", py: "2rem" }}>
                    Nuestras Gerencias
                </Typography>
                <Container sx={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                    {managements.map((item, index) => (
                        <Card
                            variant="outlined"
                            key={index}
                            sx={{
                                maxWidth: 350,
                                width: 350,
                                height: 700,
                                position: "relative",
                                overflow: "hidden",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            <CardMedia sx={{ height: 350 }} image={item.image} />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography variant="subtitle2" color="gray">
                                    {item.management}
                                </Typography>
                                <Typography key={index} variant="body2" sx={{ whiteSpace: "break-spaces", textAlign: "justify" }}>
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Container>
            </Box>
        </Box>
    );
};

export default About;
