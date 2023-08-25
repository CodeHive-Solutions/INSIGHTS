import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import cyclogo from "../images/logo-cyc-color.webp";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CarouselComponent from "../components/Carousel";
import { useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
const AboutUs = () => {
    const homeImages = [
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
    ];

    const isSmallScreen = useMediaQuery("(max-width:600px)");

    return (
        <Box sx={{ display: "flex", gap: "5rem", flexDirection: "column", width: "100%", marginTop: "6rem" }}>
            <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "30px", fontFamily: "Poppins" }}>
                Sobre Nosotros
            </Typography>
            <Box sx={{ display: "flex", gap: "2rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <Box>{isSmallScreen ? <img width={300} src={cyclogo} alt="" /> : <img width={550} src={cyclogo} alt="" />}</Box>
                <Box sx={{ width: "35rem" }}>
                    <Typography sx={{ textAlign: "justify" }}>
                        C&C Services S.A.S. es una firma que ofrece soluciones para fortalecer los ciclos de riesgo de las compañías, desde el año 2005. Nuestros
                        servicios se basan en el modelo de gestión BPO, que aporta valor con una propuesta de trabajo innovadora, eficiente y moderna. Contamos con tres
                        líneas de negocio: Services, Risk y Legal, que cubren los procesos de originación, mantenimiento y recuperación de clientes. Nuestra labor se
                        caracteriza por estrictos procedimientos y controles, una permanente autoevaluación y una alta efectividad. Además, tenemos tecnología de última
                        generación y la mejor disposición al servicio de nuestros clientes, con el objetivo principal de abrir el mercado a nuevas posibilidades.
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
                    }}
                >
                    we will win{" "}
                </Typography>
            </Box>

            <Container
                disableGutters
                maxWidth={false}
                sx={{
                    backgroundColor: "#0076A8",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "2rem",
                    flexWrap: "wrap",
                    py: "2rem",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem", width: "25rem" }}>
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
                </Box>
            </Container>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "30px", fontFamily: "Poppins" }}>
                    Nuestras Sedes
                </Typography>
                <Box sx={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                    <CarouselComponent items={homeImages} height={"80vh"} width={"20rem"} />
                    <CarouselComponent items={homeImages} height={"80vh"} width={"20rem"} />
                    <CarouselComponent items={homeImages} height={"80vh"} width={"20rem"} />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
                <Typography color="primary" sx={{ textAlign: "center", fontWeight: 600, fontSize: "30px", fontFamily: "Poppins" }}>
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
            <Box sx={{ backgroundColor: "#59CBE8", display: "flex", flexDirection: "column", gap: "2rem" }}>
                <Typography color="white" sx={{ textAlign: "center", fontWeight: 600, fontSize: "30px", fontFamily: "Poppins", py: "2rem" }}>
                    Nuestras Gerencias
                </Typography>
                <Box sx={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                    <Card sx={{ minWidth: "30rem", maxWidth: "30rem" }}>
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
