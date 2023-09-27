import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

const homeImages = [
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
];

const MediaCard = ({ title, subtitle, img, articleId }) => {
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
            <CardMedia sx={{ height: 300 }} image={img} />
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
                BLOG
            </Typography>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", textAlign: "center", gap: "2rem", flexWrap: "wrap" }}>
                <MediaCard
                    title={"Mejorando la Experiencia del Cliente en el BPO"}
                    subtitle={"Consejos y estrategias para brindar un servicio excepcional y fortalecer la lealtad del cliente en la industria de procesos de negocio."}
                    img={homeImages[0].image}
                    articleId={1}
                ></MediaCard>
                <MediaCard
                    title={"Tecnología de Vanguardia en el Call Center"}
                    subtitle={
                        "Cómo la innovación tecnológica está transformando la forma en que interactuamos con los clientes y gestionamos las operaciones en el entorno del call center."
                    }
                    img={homeImages[1].image}
                    articleId={2}
                ></MediaCard>
                <MediaCard
                    title={"Desarrollo Profesional en el Mundo del BPO"}
                    subtitle={
                        "Crecimiento y oportunidades para los empleados del centro de llamadas: estrategias para avanzar en tu carrera en el emocionante sector de externalización de procesos de negocio."
                    }
                    img={homeImages[2].image}
                    articleId={3}
                ></MediaCard>
                <MediaCard
                    title={"Optimizando la Gestión de Llamadas"}
                    subtitle={
                        "Mejores prácticas y técnicas eficaces para manejar conversaciones con los clientes y garantizar una experiencia de llamada fluida y exitosa."
                    }
                    img={homeImages[3].image}
                    articleId={4}
                ></MediaCard>
            </Box>
        </Container>
    );
};

export default Blog;
