import React from "react";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import imgAvatar from "../../images/birthdays/cristian-gonzales copy.jpeg";
import emergency from "../../images/blog/emergency.png";

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
            title: "Emergency Response in a Call Center: A Guide to Effective Action",
            nameAuthor: "Daniela",
            imgAuthor: "",
            img: emergency,
            date: "Hace 2 horas",
            subtitle: "Navigating Crisis: Strategies for Swift and Calibrated Responses in the Call Center Environment",
//             content: `Emergencies can arise unexpectedly in a call center environment, demanding swift and composed action from staff members. Whether it's a technical glitch affecting multiple callers or a customer in distress, a well-prepared team is crucial to managing these situations effectively.

// 1. Preparation is Key

// Training: Ensure all employees receive thorough training in emergency protocols, including escalation procedures and specific scenarios they might encounter.
// Familiarize with Tools: Equip staff with knowledge about the systems and tools available to handle emergencies. Practice using these tools to streamline responses.
// 2. Stay Calm and Focused

// Maintain Composure: Stress can escalate situations. Encourage agents to remain calm, reassuring, and empathetic when dealing with distressed callers.
// Active Listening: Train employees to actively listen to callers to fully understand the situation before taking action.
// 3. Clear Communication

// Use Standardized Scripts: Provide scripts for emergency scenarios to ensure consistent and accurate information delivery.
// Concise Information Sharing: Teach agents to convey crucial information clearly and succinctly, avoiding jargon or technical language that might confuse the caller.
// 4. Collaboration and Escalation

// Team Coordination: Foster a collaborative environment where team members can support each other during high-stress situations.
// Escalation Protocols: Establish clear escalation paths for situations that demand higher-level intervention, ensuring a swift and efficient response.
// 5. Post-Emergency Review and Improvement

// Debrief Sessions: Conduct debrief sessions after emergencies to analyze responses and identify areas for improvement.
// Continuous Training: Use insights gained from reviews to update and enhance training programs, keeping the team prepared for future emergencies.
// Conclusion:
// In a call center setting, emergencies can test the preparedness and efficacy of the team. By prioritizing preparation, maintaining composure, emphasizing clear communication, fostering collaboration, and learning from each situation, call centers can improve their emergency response capabilities significantly.

// Handling emergencies in a call center demands a mix of empathy, technical proficiency, and quick thinking. Empowering staff with the right tools, training, and support can ensure a smoother resolution when faced with unexpected situations.

// Remember, a well-prepared team can turn an emergency into an opportunity to showcase professionalism and dedication to customer care.`,
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
