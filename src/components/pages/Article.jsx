import React from "react";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import imgAvatar from "../../images/birthdays/cristian-gonzales copy.jpeg";

const homeImages = [
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
];

const ArticlePage = () => {
    // Get the articleId from the route parameters
    const { articleId } = useParams();

    // Fetch the content of the article with the given articleId
    // You can use this ID to fetch the specific article content from your data source (e.g., an API or local data).

    // For this example, let's assume you have an array of articles
    const articles = [
        {
            id: 1,
            title: "Mejorando la Experiencia del Cliente en el BPO",
            subtitle:
                "Cómo la innovación tecnológica está transformando la forma en que interactuamos con los clientes y gestionamos las operaciones en el entorno del call center.",
            img: homeImages[2].image,
            imgAuthor: "",
            nameAuthor: "Sebastian",
            tags: ["Customer Experience", "Call Center", "BPO"],
            content: `
                El mundo del BPO (Business Process Outsourcing) ha experimentado una revolución impulsada por la innovación tecnológica. En un entorno en constante cambio, las empresas buscan mejorar la experiencia del cliente, optimizar sus operaciones y mantenerse competitivas en el mercado.

                Una de las tendencias más destacadas en el BPO es la implementación de soluciones tecnológicas avanzadas, como la inteligencia artificial y la automatización de procesos. Estas tecnologías están transformando la forma en que interactuamos con los clientes y gestionamos las operaciones en el entorno del call center.<br/><br/>

                La automatización de tareas rutinarias y la atención al cliente impulsada por la inteligencia artificial han permitido a las empresas brindar un servicio más rápido y eficiente. Los chatbots y sistemas de respuesta automática pueden resolver consultas básicas de los clientes en cuestión de segundos, liberando a los agentes de call center para abordar problemas más complejos y brindar un servicio personalizado.<br/><br/>

                Además, la recopilación y el análisis de datos se han vuelto fundamentales para comprender las necesidades y preferencias de los clientes. Las empresas pueden utilizar análisis de datos avanzados para personalizar sus ofertas y anticipar las necesidades de los clientes, lo que a su vez mejora la experiencia del cliente.<br/><br/>

                En resumen, la innovación tecnológica está cambiando la cara del BPO. Las empresas que adoptan estas tecnologías pueden mejorar la experiencia del cliente, aumentar la eficiencia operativa y mantenerse competitivas en un mercado en constante evolución.<br/><br/>
            `,
            date: "Hace 2 horas",
        },
        {
            id: 2,
            title: "Tecnología de Vanguardia en el Call Center",
            content: "Content for the second article...",
        },
        {
            id: 3,
            title: "Tecnología de Vanguardia en el Call Center",
            content: "Content for the second article...",
        },
        {
            id: 4,
            title: "Tecnología de Vanguardia en el Call Center",
            content: "Content for the second article...",
        },
        // Add more articles here...
    ];

    // Find the article with the matching articleId
    const article = articles.find((a) => a.id === parseInt(articleId, 10));

    if (!article) {
        // Handle the case where the article is not found
        return <Typography variant="h4">Article not found</Typography>;
    }

    const contentHtml = { __html: article.content };

    return (
        <Container sx={{ height: "max-content", pt: "4rem" }}>
            <Box sx={{ height: "40vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", px: "5rem", gap: "3rem" }}>
                <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bolder", fontSize: "3em", fontFamily: "Poppins" }}>
                    {article.title}
                </Typography>
                <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "semi-bold", fontSize: "20px", fontFamily: "Poppins" }}>
                    {article.subtitle}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img style={{ borderRadius: "0.5rem" }} width={1000} src={article.img} alt="" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", px: "5rem", gap: "2rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", pt: "2rem" }}>
                    <Avatar alt="Remy Sharp" src={article.imgAuthor} sx={{ width: 56, height: 56 }} />
                    <Box>
                        <Typography>{article.nameAuthor}</Typography>
                        <Typography sx={{ color: "gray", fontSize: "12px" }}>{article.date}</Typography>
                    </Box>
                </Box>
                <Box sx={{ textAlign: "justify" }}>
                    <div dangerouslySetInnerHTML={contentHtml}></div>
                </Box>
            </Box>
        </Container>
    );
};

export default ArticlePage;
