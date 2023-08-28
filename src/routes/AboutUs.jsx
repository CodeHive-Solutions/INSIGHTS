import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import cyclogo from "../images/img-about.jpg";
import CarouselComponent from "../components/Carousel";
import { useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
import image1 from "../images/image-vision.jpg";
import image2 from "../images/image-mision.png";
import image3 from "../images/image-values.jpg";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ImageStock from "../images/stock.jpg";

const AboutUs = () => {
    const homeImages = [
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
    ];

    const managements = [
        { name: "Sandoval Cabra Melida", management: "Gerencia Administrativa", image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { name: "Gonzales Mora Diego Fernando", management: "Gerencia de Legal y Riesgo", image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { name: "Giraldo Castaño Luz Yarime", management: "Gerencia de Mercadeo", image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { name: "Paez Castiblanco Adriana Nataly", management: "Gerencia Operaciones", image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { name: "Duran Gutierrez Angela Maria", management: "Gerencia Planeación", image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        {
            name: "Giron Salazar Mario Ernesto",
            management: "Gerencia de Riesgo y Control Interno",
            image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true",
        },
        { name: "Torres Naranjo Javier Mauricio", management: "Gerencia de Tecnología", image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { name: "Garzon Navas Cesar Alberto", management: "Gerencia General", image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { name: "Ferrucho Seguro Maria Fernanda", management: "Gerencia Gestión Humana", image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
    ];

    const isSmallScreen = useMediaQuery("(max-width:600px)");

    return (
        <Box sx={{ display: "flex", gap: "5rem", flexDirection: "column", width: "100%", marginTop: "6rem" }}>
            <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "40px", fontFamily: "Poppins" }}>
                Sobre Nosotros
            </Typography>
            <Box sx={{ display: "flex", gap: "2rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                {/* <Typography sx={{ textAlign: "center", color: "#454545", fontSize: "62px", fontFamily: "Poppins", fontWeight: "500" }}>
                    ¿Quienes <br /> somos?
                </Typography> */}
                <Box>{isSmallScreen ? <img width={300} src={cyclogo} alt="" /> : <img width={500} src={cyclogo} alt="" />}</Box>
                <Box sx={{ width: "35rem" }}>
                    <Typography sx={{ color: "gray" }}>
                        C&C Services S.A.S., desde 2005, ofrece soluciones para fortalecer los ciclos de riesgo de las empresas a través de un modelo de gestión BPO
                        innovador y eficiente. Con tres líneas de negocio: Services, Risk y Legal, cubrimos los procesos de originación, mantenimiento y recuperación de
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
                {/* <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem", width: "25rem" }}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontFamily: "Poppins" }} variant="h5" component="div">
                                Nuestra Visión
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: "justify" }}>
                                En el 2025 seremos una compañía líder en la industria de los Contact Center y BPO, caracterizándonos por un portafolio integral de
                                servicios, certificados con altos estándares de calidad, soportados en tecnología de punta y cobertura internacional.
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontFamily: "Poppins" }} variant="h5" component="div">
                                Nuestra Misión{" "}
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: "justify" }}>
                                Prestar servicios de Contact Center y BPO de alta calidad con un talento humano que genere valor a nuestros clientes, basados en prácticas
                                innovadoras, experiencia, solidez en el mercado, buscando un desarrollo responsable que impacte positivamente a la sociedad.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ width: "25rem" }}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontFamily: "Poppins" }} variant="h5" component="div">
                                Nuestros Valores Corporativos
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: "justify" }}>
                                Integridad, respeto, transparencia, responsabilidad, disciplina, calidez humana, pasión y equidad. La empresa se compromete a actuar de
                                manera ética y honesta, respetando a su equipo de colaboradores, proveedores y clientes, y actuando con transparencia en todas las
                                situaciones. Además, se esfuerzan por ser responsables y disciplinados en su trabajo, tratando a los demás con calidez humana y pasión por
                                la excelencia en el servicio. Finalmente, la empresa cree en la equidad y en la igualdad de las personas, independientemente de su raza,
                                género, edad o cultura.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box> */}
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
                <Box sx={{ borderRadius: "2rem", width: "100%", height: "40rem", border: "2px solid gray" }}>
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
                        <Card key={index} sx={{ maxWidth: 350, width: 350, height: 450 }}>
                            <CardMedia sx={{ height: 350 }} image={item.image} />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.management}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Card variant="outlined" sx={{ minWidth: "30rem", maxWidth: "30rem" }}>
                        <CardContent>
                            <Typography sx={{ fontFamily: "Poppins" }} variant="h5" component="div">
                                Gerencia General
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: "justify" }}>
                                El área se encarga de guiar a todas las dependencias de la empresa para alcanzar los objetivos establecidos mediante ideas innovadoras y
                                planes de acción, siguiendo el enfoque del Sistema de Gestión de Calidad. El proceso comienza con la revisión y acompañamiento de las
                                ideas planteadas, y se realiza una auditoría constante para mejorar los indicadores y planes de acción. El proceso finaliza una vez se
                                cumplen los objetivos establecidos y se validan los estándares de calidad.
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: "30rem", maxWidth: "30rem" }}>
                        <CardContent>
                            <Typography sx={{ fontFamily: "Poppins" }} variant="h5" component="div">
                                Gerencia de Cuenta
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: "justify" }}>
                                El área de cuenta es la operación principal de la empresa y cuenta con la mayor parte de su personal. Está dirigida por un Gerente de
                                Cuenta y su equipo, que incluye Directores, Coordinadores y Asesores para cada campaña que se gestiona para clientes como Banco Caja
                                Social, Banco Falabella, Helm Bank, Citibank, Claro (Telmex y Comcel) y otros. Además, hay un equipo de analistas especializados en
                                generar informes que monitorean la gestión en cada campaña y entregan reportes a los Gerentes y Directores para control y análisis,
                                respectivamente. Los resultados y estrategias son compartidos con todo el equipo de la operación.
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: "30rem", maxWidth: "30rem" }}>
                        <CardContent>
                            <Typography sx={{ fontFamily: "Poppins" }} variant="h5" component="div">
                                Gerencia de Servicios
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: "justify" }}>
                                En el área se brinda una total asesoría a los usuarios del FNA que se encuentran en proceso de adquisición de vivienda, dándoles una
                                completa asesoría en todas las fases del proceso de adquisición de vivienda, el cual inicia una vez ha sido aprobado el crédito y finaliza
                                con el desembolso y entrega de la vivienda.
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: "30rem", maxWidth: "30rem" }}>
                        <CardContent>
                            <Typography sx={{ fontFamily: "Poppins" }} variant="h5" component="div">
                                Gerencia Legal y Riesgo
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: "justify" }}>
                                El departamento de legal y riesgo de la empresa se encarga de representar los intereses de los clientes en cuestiones legales y de riesgo.
                                El proceso comienza cuando se reciben los documentos necesarios para iniciar el proceso y se evalúa el estado actual del mismo, así como
                                los trámites realizados y pendientes. Se ejecutan planes de acción para llevar a cabo el proceso hasta su culminación, ya sea un concepto
                                o estudio. La representación se enfoca en los procesos entregados por las diferentes entidades para la gestión de los clientes.
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: "30rem", maxWidth: "30rem" }}>
                        <CardContent>
                            <Typography sx={{ fontFamily: "Poppins" }} variant="h5" component="div">
                                Gerencia Administrativa
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: "justify" }}>
                                El área se encarga de garantizar que los ingresos financieros de la empresa cubran a cabalidad todos los gastos que genera la compañía
                                tales como; impuestos, nómina, pago a proveedores y demás costos necesarios para el funcionamiento de la operación. De igual manera regula
                                que los recursos logísticos de la compañía sean utilizados adecuadamente.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default AboutUs;
