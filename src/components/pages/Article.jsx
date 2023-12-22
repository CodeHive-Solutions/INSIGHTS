import React from "react";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import imgAvatar from "../../images/birthdays/cristian-gonzales copy.jpeg";
import emergency from "../../images/blog/emergency.png";
import blog1 from "../../images/blog/blog-1.png";
import article1 from "../../images/articles/article1.jpg";
import despedida from "../../images/blog/despedida.jpg";

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
            title: "Sumando Valor: Bienvenidos a las Nuevas Campañas en C&C Services S.A.S.",
            subtitle: "Conoce Cómo las Nuevas Campañas Elevan los Estándares de Calidad y Compromiso Empresarial",
            img: article1,
            imgAuthor: "",
            nameAuthor: "Sebastian",
            tags: ["Customer Experience", "Call Center", "BPO"],
            content: `
                En un emocionante desarrollo, C&C Services S.A.S se complace en dar la bienvenida a varias campañas nuevas a nuestra creciente familia. Estamos encantados de tener a bordo a Seguros Bolívar, NuBank, Minuto de Dios, y nuestra propia campaña interna.
                <br/>
                <br/>
                <b>Seguros Bolívar:</b> Con una reputación sólida y una amplia gama de servicios, Seguros Bolívar es un nombre de confianza en el sector de seguros. Estamos emocionados de trabajar con ellos y ofrecer servicios de BPO de alta calidad para mejorar aún más su eficiencia operativa.
                <br/>
                <br/>
                <b> Campaña propia: </b> Nuestra propia campaña interna es un testimonio de nuestro compromiso con la innovación y la mejora continua. Esta iniciativa nos permitirá explorar nuevas estrategias y enfoques para ofrecer un servicio excepcional a nuestros clientes.
                <br/>
                <br/>
                <b>NuBank:</b> Como uno de los bancos digitales más grandes y de más rápido crecimiento, NuBank está revolucionando el sector financiero. Estamos ansiosos por apoyar su crecimiento y ayudarles a ofrecer una experiencia bancaria sin problemas a sus clientes.
                <br/>
                <br/>
                <b>Minuto de Dios:</b> Esta campaña se centra en la recuperación de cartera. Su objetivo es asegurar que los recursos se utilicen de manera efectiva y eficiente, permitiendo a Minuto de Dios continuar su misión de hacer una diferencia en las vidas de las personas. Estamos emocionados de apoyar esta importante iniciativa y ayudar a Minuto de Dios a maximizar su impacto.
                <br/>
                <br/>
                Estamos emocionados por las oportunidades que estas nuevas campañas traerán y estamos comprometidos a ofrecer servicios de BPO de la más alta calidad. Agradecemos a todos nuestros nuevos socios por su confianza en nosotros y esperamos una colaboración exitosa.
                <br/>
                <br/>
                ¡Bienvenidos a bordo!
            `,
            date: "Hace 2 horas",
        },
        {
            id: 2,
            title: "C&C Services Celebra una Integración Innovadora para Cerrar el Año 2023 con Éxito",
            subtitle: "Celebrando el Poder del Compartir y la Eucaristía como Símbolo de Agradecimiento",
            img: despedida,
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
        <Container sx={{ height: "max-content", pt: "5rem" }}>
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
                {/* <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", pt: "2rem" }}>
                    <Avatar alt="Remy Sharp" src={article.imgAuthor} sx={{ width: 56, height: 56 }} />
                    <Box>
                        <Typography>{article.nameAuthor}</Typography>
                        <Typography sx={{ color: "gray", fontSize: "12px" }}>{article.date}</Typography>
                    </Box>
                </Box> */}
                <Box sx={{ textAlign: "justify", pt: "2rem" }}>
                    <div dangerouslySetInnerHTML={contentHtml}></div>
                </Box>
            </Box>
        </Container>
    );
};

export default ArticlePage;
