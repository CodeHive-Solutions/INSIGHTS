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
import cibersecurity from "../../images/blog/cibersecurity.jpg";
import bienestar from "../../images/blog/bienestar.jpg";

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
            content: `En un emotivo acto que marcó el cierre del año 2023, los empleados y directivos de C&C Services se reunieron en un acto especial de agradecimiento y celebración. Este evento, que se ha convertido en una tradición anual, no solo fue un momento para reflexionar sobre los logros alcanzados, sino también para fortalecer los lazos de unidad y compañerismo entre todos los miembros de esta reconocida empresa.
            <br/>
            <br/>
            Una eucaristía, celebrada en un ambiente de serenidad y solemnidad, fue un espacio para expresar gratitud por los éxitos alcanzados a lo largo del año y para reconocer el esfuerzo y dedicación de cada individuo que forma parte de este equipo. Bajo la premisa de que el agradecimiento fortalece los lazos y alimenta el espíritu de equipo, se llevó a cabo esta ceremonia que trasciende lo meramente laboral para abrazar lo humano y lo espiritual; se destacó la importancia de valorar el trabajo en equipo y el compromiso mutuo en la consecución de metas.
            <br/>
            <br/>
            "La unidad es la base de nuestra fortaleza como empresa", mencionó César Garzón, Gerente General de C&C Services. "Eventos como este nos recuerdan la importancia de trabajar juntos, de valorar cada aporte individual y de celebrar nuestras victorias como equipo".
            <br/>
            <br/>
            El compromiso de C&C Services con la integración, el agradecimiento y el trabajo en equipo se evidencia una vez más en esta emotiva celebración de fin de año, dejando una huella imborrable en la historia de la empresa y en el corazón de cada uno de sus colaboradores.`,
        },
        {
            id: 3,
            title: "Protegiendo la Confianza Digital: C&C Services y la Ciberseguridad en la Era Actual",
            subtitle: "C&C Services y la Ciberseguridad en la Era Actual",
            img: cibersecurity,
            content: ` <p>En la era digital, donde la información es un activo invaluable, la seguridad cibernética se convierte en un pilar fundamental para empresas como la nuestra, comprometida con brindar servicios de calidad y confiabilidad a nuestros clientes. En C&C Services, la protección de los datos y la salvaguardia de la confianza que depositan en nosotros son prioridades inquebrantables.</p>

            <h2>¿Por qué la Ciberseguridad Importa para C&C Services?</h2>

            <p>Nuestros servicios se basan en la confianza mutua con nuestros clientes. Mantener la seguridad de su información sensible es esencial para preservar esta confianza. En un mundo cada vez más interconectado, las amenazas cibernéticas son una realidad constante. Desde intentos de acceso no autorizado hasta la manipulación de datos, nos enfrentamos a desafíos que requieren una preparación y respuesta efectivas.</p>

            <h2>Compromiso de C&C Services con la Ciberseguridad</h2>

            <p>En nuestra empresa, la ciberseguridad no es solo una tarea, es una cultura arraigada en cada proceso y cada interacción. Estamos comprometidos con:</p>

            <ul>
            <li><strong>Educación y Concienciación Continua:</strong> Proporcionamos programas de capacitación regulares para sensibilizar a nuestro equipo sobre las últimas amenazas y mejores prácticas de seguridad.</li>
            <li><strong>Infraestructura y Tecnología Robusta:</strong> Implementamos firewalls, sistemas de detección de intrusiones y medidas de seguridad avanzadas para proteger nuestra red y sistemas.</li>
            <li><strong>Políticas Rigurosas de Acceso y Control:</strong> Establecemos controles de acceso estrictos y prácticas de autenticación fuertes para garantizar la protección de la información confidencial.</li>
            </ul>

            <p>Nuestra Comunidad de Protección Cibernética</p>

            <p>C&C Services reconoce que la seguridad cibernética es un esfuerzo colectivo. Nuestros empleados, socios y clientes tienen un papel fundamental en la protección de la información. Fomentamos una cultura de comunicación abierta y alentamos a todos a informar cualquier actividad sospechosa para una respuesta inmediata.</p>

            <h2>Mirando hacia el Futuro</h2>

            <p>En un mundo digital en constante evolución, estamos comprometidos con la mejora continua de nuestras defensas cibernéticas. Mantener la seguridad de la información es un viaje sin fin que requiere adaptación constante y vigilancia.</p>

            <p>En C&C Services, la ciberseguridad no es solo un objetivo, es una promesa. Estamos dedicados a preservar la integridad de los datos de nuestros clientes y a proteger la confianza que depositan en nosotros. Juntos, construimos un entorno digital seguro y confiable para un futuro próspero.</p>`,
        },
        {
            id: 4,
            title: "C&C Services: Innovación en el Bienestar Laboral para Empleados Productivos",
            subtitle: "Una Mirada Profunda a los Programas de Bienestar Integral y su Impacto en la Productividad y la Satisfacción Laboral",
            img: bienestar,
            content: ` <article>
            <p>En el mundo empresarial actual, el bienestar laboral se ha convertido en un pilar fundamental para garantizar la productividad, la satisfacción del empleado y un ambiente laboral saludable. En este contexto, empresas líderes como C&C Services han ido más allá de lo convencional, marcando pauta en la implementación de programas innovadores de bienestar que transforman la experiencia laboral de sus colaboradores.</p>

            <p>C&C Services ha desarrollado una estrategia integral para cuidar el bienestar de sus empleados. Esto se refleja en programas que abarcan desde el bienestar físico hasta el apoyo emocional. La empresa promueve activamente la actividad física mediante la provisión de membresías en gimnasios locales y la organización de clases de yoga semanales en sus instalaciones.</p>

            <p>Además, la salud mental es una prioridad en C&C Services. Han implementado políticas que ofrecen acceso a asesoramiento psicológico confidencial, así como sesiones regulares de mindfulness para ayudar a los empleados a manejar el estrés y mejorar su bienestar emocional.</p>

            <p>La flexibilidad laboral es otro pilar en la estrategia de bienestar de la empresa. Reconociendo la importancia del equilibrio entre el trabajo y la vida personal, se permiten horarios flexibles y se fomenta el trabajo remoto cuando sea posible.</p>

            <p>Esta cultura de apoyo y reconocimiento se refleja en los programas de premios por desempeño destacado, así como en las oportunidades de desarrollo profesional que se ofrecen a los empleados de C&C Services.</p>

            <p>En resumen, C&C Services se ha convertido en un referente en el ámbito empresarial al priorizar el bienestar integral de sus empleados. Su enfoque estratégico y proactivo hacia el bienestar físico, mental y emocional ha demostrado ser un motor clave para una fuerza laboral productiva y satisfecha.</p>
        </article>`,
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
        <Container sx={{ height: "max-content" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", px: "5rem", pt: "7rem", pb: "2rem", gap: "3rem" }}>
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
