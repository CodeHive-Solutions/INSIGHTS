import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, CardMedia, Typography, CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import pablo from "../../images/managers/pablo.jpeg";
import cesarGarzon from "../../images/managers/cesar-garzon.jpg";
import diegoGonzales from "../../images/managers/diego-gonzales.jpg";
import angelaDuran from "../../images/managers/angela-duran.jpeg";
import adrianaPaez from "../../images/managers/adriana-paez.jpg";
import hectorSotelo from "../../images/managers/hector-sotelo.png";
import yannethPinzon from "../../images/managers/yanneth-pinzon.webp";
import marioGiron from "../../images/managers/mario-giron.jpg";
import melidaSandoval from "../../images/managers/melida-sandoval.jpg";

import managersJr1 from "../../images/managers-jr/52716114.webp";
import managersJr2 from "../../images/managers-jr/53069726.webp";
import managersJr3 from "../../images/managers-jr/1014205170.webp";
import managersJr4 from "../../images/managers-jr/1016002011.webp";
import managersJr5 from "../../images/managers-jr/1016033764.webp";
import managersJr6 from "../../images/managers-jr/91498957.webp";
import managersJr7 from "../../images/managers-jr/79509094.webp";
import managersJr8 from "../../images/managers-jr/28553156.webp";
import managersJr9 from "../../images/managers-jr/1010178143.webp";

const managersJr = [
    {
        name: "Rodrigo Lozano",
        management: "GERENTE JR INFRAESTRUCTURA Y REDES",
        image: managersJr7,
        description: "",
    },
    {
        name: "Marcela Osorio",
        management: "GERENTE JR. DE MESA DE SERVICIO",
        image: managersJr8,
        description: "",
    },
    {
        name: "Christian Moncaleano",
        management: "GERENTE JR. DE APLICACIONES DE CONTACT CENTER",
        image: managersJr9,
        description: "",
    },
    {
        name: "Adriana Barrera",
        management: "GERENTE DE CUENTAS",
        image: managersJr1,
        description: "",
    },
    {
        name: "Katterene Castrillon",
        management: "GERENTE DE CUENTAS",
        image: managersJr2,
        description: "",
    },
    {
        name: "Karen Romero",
        management: "GERENTE DE CUENTAS JR",
        image: managersJr3,
        description: "",
    },
    {
        name: "Luis Pachon",
        management: "GERENTE DE CUENTAS",
        image: managersJr4,
        description: "",
    },
    {
        name: "Luis Rodriguez",
        management: "GERENTE DE CUENTAS JR",
        image: managersJr5,
        description: "",
    },
    {
        name: "Julio Cesar",
        management: "GERENTE DE CUENTAS",
        image: managersJr6,
        description: "",
    },
];

const managements = [
    {
        name: "Pablo Castañeda",
        management: "Presidente",
        image: pablo,
        description: "",
    },
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
        name: "Angela Durán",
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
        name: "Héctor Gabriel Sotelo",
        management: "Gerente de Operaciones de Ventas",
        image: hectorSotelo,
        description:
            "Liderar, planificar y controlar las operaciones de las campañas de Servicios y Ventas, con equipos productivos y con alta calidad que garanticen los resultados frente a los clientes y la rentabilidad de cada una de ellas.",
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
        name: "Mélida Sandoval",
        management: "Gerente Administrativa",
        image: melidaSandoval,
        description:
            "Planear, controlar las políticas de administración de recursos financieros, garantizando el abastecimiento oportuno de bienes y servicios que permiten el adecuado funcionamiento de la organización,  manteniendo un  adecuado relacionamiento con los bancos para asegurar la disponibilidad y el control de los recursos financieros de la compañía y controlando la causación contable de manera oportuna.",
    },
];

export default class SimpleSlider extends Component {
    render() {
        const settings = {
            infinite: true,
            slidesToShow: 3,
            autoplay: true,
            speed: 5000,
            autoplaySpeed: 5000,
            cssEase: "linear",
            pauseOnHover: false,
        };
        return (
            <Box sx={{ p: "2rem" }}>
                <Slider {...settings}>
                    {managersJr.map((item, index) => (
                        <Card
                            variant="outlined"
                            key={index}
                            sx={{
                                maxWidth: 350,
                                width: 350,
                                height: 450,
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
                            </CardContent>
                        </Card>
                    ))}
                </Slider>
            </Box>
        );
    }
}
