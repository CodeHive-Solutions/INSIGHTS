import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import article1 from "../../images/articles/article1.jpg";
import despedida from "../../images/blog/despedida.jpg";
import cibersecurity from "../../images/blog/cibersecurity.jpg";
import bienestar from "../../images/blog/bienestar.jpg";
import article5 from "../../images/blog/article5.jpg";
import sstGestion from "../../images/blog/sst-gestion-ambiental.jpg";
import carteraPropia from "../../images/blog/cartera-propia.jpg";

const homeImages = [
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
];

const MediaCard = ({ title, subtitle, img, articleId }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoaded = () => {
        setImageLoaded(true);
    };

    const navigate = useNavigate();

    const handleCardClick = () => {
        // Navigate to the article page with the articleId as a route parameter
        navigate(`/logged/blog/article/${articleId}`);
    };

    return (
        <Card
            sx={{
                maxWidth: 500,
                textAlign: "left",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                    transform: "scale(1.05)",
                },
            }}
            onClick={handleCardClick}
        >
            <CardMedia
                sx={{ height: 300 }}
                image={img}
                onLoad={handleImageLoaded} // Call handleImageLoaded when the image is loaded
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );
};

const Blog = () => {
    return (
        <Container
            sx={{
                height: "max-content",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "6rem",
            }}
        >
            <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }} variant={"h4"}>
                Blog
            </Typography>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", textAlign: "center", gap: "2rem", flexWrap: "wrap" }}>
                <MediaCard
                    title={"Desde Adentro: Cómo Nuestra Cartera Propia Define Nuestra Trayectoria en el BPO"}
                    subtitle={"Una Mirada Interna a Cómo la Gestión de la Cartera Eleva Nuestro Desempeño en el BPO"}
                    img={carteraPropia}
                    articleId={7}
                ></MediaCard>
                <MediaCard
                    title={"Elevando Nuestra Empresa: Certificaciones ISO 45001:2018 y 14001:2015"}
                    subtitle={
                        "Alcanzando la Excelencia Empresarial: La Trascendencia de las Certificaciones ISO 45001:2018 y 14001:2015, el Impacto en Nuestra Organización y el Compromiso Fundamental de Nuestros Colaboradores"
                    }
                    img={sstGestion}
                    articleId={6}
                ></MediaCard>
                <MediaCard
                    title={"C&C Services SAS avanza en proceso de certificación para elevar estándares de calidad en la industria de la cobranza"}
                    subtitle={"Compromiso con la excelencia: Un vistazo al proceso de certificación C&C de RACC."}
                    img={article5}
                    articleId={5}
                ></MediaCard>
                <MediaCard
                    title={"Sumando Valor: Bienvenidos a las Nuevas Campañas en C&C Services S.A.S."}
                    subtitle={"Uniendo Fuerzas para Alcanzar Nuevos Horizontes de Éxito y Crecimiento"}
                    img={article1}
                    articleId={1}
                ></MediaCard>

                <MediaCard
                    title={"Desarrollo Profesional en el Mundo del BPO"}
                    subtitle={"C&C Services y la Ciberseguridad en la Era Actual"}
                    img={cibersecurity}
                    articleId={3}
                ></MediaCard>
                <MediaCard
                    title={"C&C Services: Innovación en el Bienestar Laboral para Empleados Productivos"}
                    subtitle={"Una Mirada Profunda a los Programas de Bienestar Integral y su Impacto en la Productividad y la Satisfacción Laboral"}
                    img={bienestar}
                    articleId={4}
                ></MediaCard>
            </Box>
        </Container>
    );
};

export default Blog;
