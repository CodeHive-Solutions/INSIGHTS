import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import imgAvatar from "../../images/birthdays/cristian-gonzales copy.jpeg";
import article1 from "../../images/articles/article1.jpg";
import despedida from "../../images/blog/despedida.jpg";
import cibersecurity from "../../images/blog/cibersecurity.jpg";
import bienestar from "../../images/blog/bienestar.jpg";
import article5 from "../../images/blog/article5.jpg";
import sstGestion from "../../images/blog/sst-gestion-ambiental.jpg";
import sstGestion2 from "../../images/blog/sst-gestion-ambiental-2.jpg";
import sstGestion3 from "../../images/blog/sst-gestion-ambiental-3.jpg";
import carteraPropia from "../../images/blog/cartera-propia.jpg";
import carteraPropia2 from "../../images/blog/cartera-propia-2.jpg";
import racc from "../../images/blog/racc.jpg";
import raccLogo from "../../images/blog/racc.png";
import elLibertador from "../../images/blog/el-libertador.png";
import bancoSantander from "../../images/blog/banco-santander.png";
import cooperativaMinutodeDios from "../../images/blog/cooperativa-minuto-de-dios.png";
import nuBank from "../../images/blog/nubank.png";
import carteraPropiaLogo from "../../images/blog/cartera-propia-logo.png";

const homeImages = [
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
    { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
];

const ArticlePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // Get the articleId from the route parameters
    const { articleId } = useParams();

    // Fetch the content of the article with the given articleId
    // You can use this ID to fetch the specific article content from your data source (e.g., an API or local data).

    // For this example, let's assume you have an array of articles
    const articles = [
        {
            id: 1,
            title: "Sumando Valor: Bienvenidos a las Nuevas Campañas en C&C Services",
            subtitle: "Conoce Cómo las Nuevas Campañas Elevan los Estándares de Calidad y Compromiso Empresarial",
            img: article1,
            imgAuthor: "",
            nameAuthor: "Sebastian",
            tags: ["Customer Experience", "Call Center", "BPO"],
            content: (
                <>
                    <p>
                        En un emocionante desarrollo, C&amp;C Services S.A.S se complace en dar la bienvenida a varias campañas nuevas a nuestra creciente familia.
                        Estamos encantados de tener a bordo a El Libertador del grupo Seguros Bolívar, NuBank, Cooperativa Minuto de Dios, Banco Santander y nuestra
                        propia campaña interna.
                    </p>
                    <b>El Libertador:</b> Por parte del grupo Seguros Bolivar presentamos a la campaña el Libertador con una reputación sólida y una amplia gama de
                    servicios, siendo uno de los nombres de confianza en el sector de seguros. Estamos emocionados de trabajar con ellos y ofrecer servicios de BPO de
                    alta calidad para mejorar aún más su eficiencia operativa.
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <img style={{ borderRadius: "8px" }} width="500" src={elLibertador} alt="" />
                    </div>
                    <b>Cartera propia:</b> Nuestra cartera propia interna es un testimonio de nuestro compromiso con la innovación y la mejora continua. Esta iniciativa
                    nos permitirá explorar nuevas estrategias y enfoques para ofrecer un servicio excepcional a nuestros clientes.
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <img style={{ borderRadius: "8px" }} width="500" src={carteraPropiaLogo} alt="" />
                    </div>
                    <b>NuBank:</b> Como uno de los bancos digitales más grandes y de más rápido crecimiento, NuBank está revolucionando el sector financiero. Estamos
                    ansiosos por apoyar su crecimiento y ayudarles a ofrecer una experiencia bancaria sin problemas a sus clientes.
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <img style={{ borderRadius: "8px" }} width="200" src={nuBank} alt="" />
                    </div>
                    <b>Cooperativa Minuto de Dios:</b> Esta campaña se centra en la recuperación de cartera. Su objetivo es asegurar que los recursos se utilicen de
                    manera efectiva y eficiente, permitiendo a Cooperativa Minuto de Dios continuar su misión de hacer una diferencia en las vidas de las personas.
                    Estamos emocionados de apoyar esta importante iniciativa y ayudar a Cooperativa Minuto de Dios a maximizar su impacto.
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <img style={{ borderRadius: "8px" }} width="400" src={cooperativaMinutodeDios} alt="" />
                    </div>
                    <b>Campaña Banco Santander:</b> Estamos entusiasmados de presentar la nueva campaña del Banco Santander, una institución reconocida por su trayectoria
                    sólida y su compromiso con la excelencia en servicios financieros. Esta colaboración nos llena de orgullo, ya que nos permite ofrecer soluciones
                    innovadoras que optimizan la experiencia bancaria para nuestros clientes. Estamos comprometidos con el éxito de esta iniciativa, la cual reafirma
                    nuestro compromiso de seguir marcando la pauta en la industria financiera.
                    <div style={{ textAlign: "center" }}>
                        <img style={{ borderRadius: "8px" }} width="300" src={bancoSantander} alt="" />
                    </div>
                    <p>
                        Estamos emocionados por las oportunidades que estas nuevas campañas traerán y estamos comprometidos a ofrecer servicios de BPO de la más alta
                        calidad. Agradecemos a todos nuestros nuevos socios por su confianza en nosotros y esperamos una colaboración exitosa.
                    </p>
                    <p>¡Bienvenidos a bordo!</p>
                </>
            ),
            date: "Hace 2 horas",
        },
        {
            id: 3,
            title: "Protegiendo la Confianza Digital: C&C Services y la Ciberseguridad en la Era Actual",
            subtitle: "C&C Services y la Ciberseguridad en la Era Actual",
            img: cibersecurity,
            content: (
                <>
                    <p>
                        En la era digital, donde la información es un activo invaluable, la seguridad cibernética se convierte en un pilar fundamental para emprecomo la
                        nuestra, comprometida con brindar servicios de calidad y confiabilidad a nuestros clientes. En C&C Services, la protección de los datos y la
                        salvaguardia de la confianza que depositan en nosotros son prioridades inquebrantables.
                    </p>

                    <h2>¿Por qué la Ciberseguridad Importa para C&C Services?</h2>

                    <p>
                        Nuestros servicios se basan en la confianza mutua con nuestros clientes. Mantener la seguridad de su información sensible es esencial para
                        preservar esta confianza. En un mundo cada vez más interconectado, las amenazas cibernéticas son una realidad constante. Desde intentos de acceso
                        no autorizado hasta la manipulación de datos, nos enfrentamos a desafíos que requieren una preparación y respuesta efectivas.
                    </p>

                    <h2>Compromiso de C&C Services con la Ciberseguridad</h2>

                    <p>
                        En nuestra empresa, la ciberseguridad no es solo una tarea, es una cultura arraigada en cada proceso y cada interacción. Estamos comprometidos
                        con:
                    </p>

                    <ul>
                        <li>
                            <strong>Educación y Concienciación Continua:</strong> Proporcionamos programas de capacitación regulares para sensibilizar a nuestro equipo
                            sobre las últimas amenazas y mejores prácticas de seguridad.
                        </li>
                        <li>
                            <strong>Infraestructura y Tecnología Robusta:</strong> Implementamos firewalls, sistemas de detección de intrusiones y medidas de seguridad
                            avanzadas para proteger nuestra red y sistemas.
                        </li>
                        <li>
                            <strong>Políticas Rigurode Acceso y Control:</strong> Establecemos controles de acceso estrictos y prácticas de autenticación fuertes para
                            garantizar la protección de la información confidencial.
                        </li>
                    </ul>

                    <p>Nuestra Comunidad de Protección Cibernética</p>

                    <p>
                        C&C Services reconoce que la seguridad cibernética es un esfuerzo colectivo. Nuestros empleados, socios y clientes tienen un papel fundamental en
                        la protección de la información. Fomentamos una cultura de comunicación abierta y alentamos a todos a informar cualquier actividad sospechosa para
                        una respuesta inmediata.
                    </p>

                    <h2>Mirando hacia el Futuro</h2>

                    <p>
                        En un mundo digital en constante evolución, estamos comprometidos con la mejora continua de nuestras defencibernéticas. Mantener la seguridad de
                        la información es un viaje sin fin que requiere adaptación constante y vigilancia.
                    </p>

                    <p>
                        En C&C Services, la ciberseguridad no es solo un objetivo, es una promesa. Estamos dedicados a preservar la integridad de los datos de nuestros
                        clientes y a proteger la confianza que depositan en nosotros. Juntos, construimos un entorno digital seguro y confiable para un futuro próspero.
                    </p>
                </>
            ),
        },
        {
            id: 4,
            title: "C&C Services: Innovación en el Bienestar Laboral para Empleados Productivos",
            subtitle: "Una Mirada Profunda a los Programas de Bienestar Integral y su Impacto en la Productividad y la Satisfacción Laboral",
            img: bienestar,
            content: (
                <article>
                    <p>
                        En el mundo empresarial actual, el bienestar laboral se ha convertido en un pilar fundamental para garantizar la productividad, la satisfacción
                        del empleado y un ambiente laboral saludable. En este contexto, emprelíderes como C&C Services han ido más allá de lo convencional, marcando pauta
                        en la implementación de programas innovadores de bienestar que transforman la experiencia laboral de sus colaboradores.
                    </p>

                    <p>
                        C&C Services ha desarrollado una estrategia integral para cuidar el bienestar de sus empleados. Esto se refleja en programas que abarcan desde el
                        bienestar físico hasta el apoyo emocional. La empresa promueve activamente la actividad física mediante la provisión de membresías en gimnasios
                        locales y la organización de clases de yoga semanales en sus instalaciones.
                    </p>

                    <p>
                        Además, la salud mental es una prioridad en C&C Services. Han implementado políticas que ofrecen acceso a asesoramiento psicológico confidencial,
                        así como sesiones regulares de mindfulness para ayudar a los empleados a manejar el estrés y mejorar su bienestar emocional.
                    </p>

                    <p>
                        La flexibilidad laboral es otro pilar en la estrategia de bienestar de la empresa. Reconociendo la importancia del equilibrio entre el trabajo y
                        la vida personal, se permiten horarios flexibles y se fomenta el trabajo remoto cuando sea posible.
                    </p>

                    <p>
                        Esta cultura de apoyo y reconocimiento se refleja en los programas de premios por desempeño destacado, así como en las oportunidades de desarrollo
                        profesional que se ofrecen a los empleados de C&C Services.
                    </p>

                    <p>
                        En resumen, C&C Services se ha convertido en un referente en el ámbito empresarial al priorizar el bienestar integral de sus empleados. Su enfoque
                        estratégico y proactivo hacia el bienestar físico, mental y emocional ha demostrado ser un motor clave para una fuerza laboral productiva y
                        satisfecha.
                    </p>
                </article>
            ),
        },
        {
            id: 5,
            title: "C&C Services avanza en proceso de certificación para elevar estándares de calidad en la industria de la cobranza",
            subtitle: "Compromiso con la excelencia: Un vistazo al proceso de certificación C&C de RACC.",
            img: article5,
            content: (
                <article>
                    <h1>Proceso de Certificación de Empresa</h1>
                    <p>
                        Desde el año 2023, la empresa ha iniciado un relevante proceso de certificación en el marco del Referencial de Autorregulación Asociación
                        Colombiana de la Industria de la Cobranza (RACC), liderado por COLCOB.
                    </p>
                    <p>
                        Este proceso de certificación se desarrolla en dos etapas, cada una con sus respectivas fases, buscando fortalecer y optimizar los estándares de
                        operación de la empresa.
                    </p>
                    <p>
                        En la primera etapa, ejecutada durante el 2023, la empresa participó en una consultoría brindada por COLCOB. Esta agremiación, que reúne a las
                        cade cobranzas más destacadas en Colombia, reconoció a C&C Sevices entre los 10 primeros lugares en su ranking.
                    </p>
                    <p>
                        Tras finalizar esta consultoría y tomar en consideración oportunidades de mejora identificadas, la empresa dio inicio al proceso oficial de
                        certificación con la empresa SGS. Este proceso se divide en dos fases: la primera tendrá lugar el próximo 18 de enero, donde se llevará a cabo una
                        revisión general de las 7 dimensiones establecidas; la segunda fase se llevará a cabo del 6 al 9 de febrero, profundizando en la validación de las
                        evidencias y el cumplimiento de los diferentes puntos de la norma.
                    </p>

                    <div style={{ textAlign: "center" }}>
                        <img style={{ borderRadius: "8px" }} width="700" src={racc} alt="" />
                    </div>

                    <p>Las 7 dimensiones clave que aborda este proceso son:</p>
                    <ul>
                        <li>
                            <b> Gobierno Corporativo:</b> Conjunto de políticas, normas y procedimientos que regulan el funcionamiento de los órganos de gobierno de la
                            empresa.
                        </li>
                        <li>
                            <b>Gestión Operacional:</b> Políticas y procedimientos que rigen la administración de los procesos y el modelo de operación de la empresa.
                        </li>
                        <li>
                            <b>Gestión del Talento Humano:</b> Normativas relacionadas con la adecuada administración de los procesos vinculados al personal de la
                            empresa.
                        </li>
                        <li>
                            <b>Gestión de Calidad y Servicio:</b> Regulación de los procesos relacionados con la calidad de los productos y servicios, así como la
                            satisfacción del cliente.
                        </li>
                        <li>
                            <b>Gestión de Riesgos:</b> Normas que regulan la gestión de los riesgos asociados al modelo de negocio y operación.
                        </li>
                        <li>
                            <b>Gestión de Tecnología:</b> Políticas para la administración de recursos tecnológicos, soporte operativo y seguridad de la información.
                        </li>
                        <li>
                            <b>Metodología para la gestión, mejora y excelencia:</b> Procedimientos para potenciar procesos críticos mediante supervisión, control y
                            documentación.
                        </li>
                    </ul>
                    <p>
                        Cada uno de nosotros hace parte de esta certificación, por lo cual los invitamos a que con sus jefes inmediatos consulten de qué manera van a
                        estar aportando y en equipo garanticemos cerrar de manera exitosa.
                    </p>
                </article>
            ),
        },
        {
            id: 6,
            title: "Certificaciones ISO 14001 y 45001: Compromiso con el Entorno y la Seguridad en C&C",
            subtitle:
                "Alcanzando la Excelencia Empresarial: La Trascendencia de las Certificaciones ISO 45001:2018 y 14001:2015, el Impacto en Nuestra Organización y el Compromiso Fundamental de Nuestros Colaboradores",
            img: sstGestion,
            content: (
                <>
                    <p>
                        La ISO 14001 y la ISO 45001 destacan el compromiso de C&C Services con la sostenibilidad y la seguridad laboral, respectivamente. La primera,
                        enfocada en el Sistema de Gestión Ambiental (SGA), asegura que la empresa gestione de manera efectiva sus impactos ambientales, promoviendo
                        prácticas sostenibles. Por otro lado, la ISO 45001 establece un marco para identificar, evaluar y gestionar los riesgos laborales, garantizando un
                        entorno de trabajo seguro y saludable. Estas certificaciones refuerzan el compromiso de C&C Services con la excelencia operativa y la
                        responsabilidad empresarial.
                    </p>

                    <h2>Importancia de las Certificaciones ISO 14001 y 45001 en C&C Services </h2>
                    <p>
                        La Certificación ISO 14001 de C&C Services refleja un compromiso sólido con la sostenibilidad, superando las regulaciones ambientales y
                        anticipando desafíos emergentes. Esta norma no solo cumple con estándares, sino que los establece.
                    </p>
                    <p>
                        Por otro lado, la Certificación ISO 45001 destaca el compromiso de la empresa con la seguridad y salud de los empleados, más allá de cumplir con
                        regulaciones legales. C&C Services prioriza la prevención proactiva de riesgos laborales, demostrando responsabilidad ética y social. Ambas
                        certificaciones no solo son reconocimientos externos, sino también pilares fundamentales que definen la excelencia en C&C Services .
                    </p>

                    <div style={{ textAlign: "center" }}>
                        <img style={{ borderRadius: "8px" }} width="700" src={sstGestion3} alt="" />
                    </div>

                    <h2>Beneficios de Certificaciones ISO para C&C Services </h2>
                    <h3>ISO 14001:</h3>
                    <ol>
                        <li>Reputación Positiva: Construye una sólida reputación al mostrar el compromiso de C&C Services con la sostenibilidad.</li>
                        <li>Cumplimiento Legal: Proporciona un marco para cumplir con regulaciones ambientales, minimizando riesgos legales.</li>
                        <li>Eficiencia Operativa: Optimiza procesos, reduce residuos y mejora eficiencia, generando ahorros operativos.</li>
                        <li>Atracción de Clientes Sostenibles: Diferencia a la empresa en un mercado que valora la sostenibilidad.</li>
                    </ol>

                    <h3>ISO 45001:</h3>
                    <ol>
                        <li>Seguridad Laboral: Reduce accidentes y mejora la seguridad de los empleados.</li>
                        <li>Cumplimiento Normativo: Garantiza el cumplimiento de normativas de seguridad y salud, evitando sanciones.</li>
                        <li>Productividad: Un entorno seguro contribuye a la productividad y mejora la moral y motivación.</li>
                        <li>Retención de Talento: Muestra compromiso con la salud y seguridad, influyendo positivamente en la retención de talento.</li>
                    </ol>
                    <div style={{ textAlign: "center" }}>
                        <img style={{ borderRadius: "8px" }} width="700" src={sstGestion2} alt="" />
                    </div>
                    <h2>Perspectivas Claves en C&C Services para Sostenibilidad y Seguridad</h2>
                    <h3>Perspectiva Operativa:</h3>
                    <p>
                        En la operación diaria, C&C Services prioriza la conciencia ambiental y de seguridad. La capacitación busca que los colaboradores comprendan cómo
                        sus acciones impactan el medio ambiente y su seguridad. Se fomenta la participación activa en la identificación y gestión de aspectos ambientales
                        y riesgos laborales, junto con la implementación de prácticas sostenibles.
                    </p>

                    <h3>Perspectiva Administrativa:</h3>
                    <p>
                        Desde la administración, se integran los procesos con los estándares ISO para asegurar el cumplimiento normativo. Las auditorías internas
                        periódicas evalúan el desempeño y la conformidad, identificando oportunidades de mejora. La comunicación transparente sobre objetivos y logros en
                        sostenibilidad y seguridad motiva la participación de los colaboradores.
                    </p>

                    <h3>Cultura Organizacional:</h3>
                    <p>
                        A nivel cultural, C&C Services busca incorporar la responsabilidad ambiental y la seguridad en todos los niveles de la empresa. Se reconocen y
                        recompensan las contribuciones individuales y colectivas al cumplimiento de los estándares ISO, construyendo una cultura que valora la
                        sostenibilidad y la seguridad como parte integral de la identidad organizacional.
                    </p>

                    <p>
                        En resumen, las certificaciones ISO 14001 y 45001 no solo son un distintivo de calidad, sino que también demuestran el compromiso de C&C Services
                        con el medio ambiente, la seguridad y el bienestar de sus colaboradores. La participación activa y comprometida de los empleados en todos los
                        niveles es fundamental para garantizar el éxito y la sostenibilidad de estos sistemas de gestión.
                    </p>
                </>
            ),
        },
        {
            id: 7,
            title: "Desde Adentro: Cómo Nuestra Cartera Propia Define Nuestra Trayectoria en el BPO",
            subtitle: "Una Mirada Interna a Cómo la Gestión de la Cartera Eleva Nuestro Desempeño en el BPO",
            img: carteraPropia,
            content: (
                <div>
                    <h1>¿Por qué campaña propia?</h1>
                    <p>
                        C&amp;C a través del tiempo se ha caracterizado por ser una empresa de recuperación de cartera de grandes portafolios como CLARO, BANCO FALABELA,
                        METLIFE, entre otros. Para el 2024, se inicia una aventura de la primera compra de cartera con el objetivo de ganar experiencia y abrir el mercado
                        de portafolios propios.
                    </p>
                    <p>
                        C&amp;C, al adquirir una campaña propia, logra posicionarse como uno de los call centers con más experiencia en el mercado, garantizando a
                        nuestros clientes un aliado estratégico para los planes y metas de sus campañas. Esta campaña al interior de la compañía juega un rol importante
                        para la parte financiera, tecnológica y de gestión humana, ya que se logra potencializar cada una de las áreas para ser un aliado más compacto
                        para nuestros clientes.
                    </p>
                    <div style={{ textAlign: "center" }}>
                        <img style={{ borderRadius: "8px" }} width="700" src={carteraPropia2} />
                    </div>
                    <h2>¿Qué es campaña propia?</h2>
                    <p>
                        La campaña propia es un conjunto de clientes que se encontraban en mora con sus respectivas entidades bancarias. Estos clientes presentan una edad
                        de mora mayor a los 400 días de castigo y/o son clientes que son renuentes al pago y la deuda, motivo por el cual la entidad decide vender esta
                        deuda a casas externas y recuperar una parte del valor adeudado.
                    </p>
                </div>
            ),
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
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", px: "5rem", pt: "7rem", pb: "2rem", gap: "2rem" }}>
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
                <Box sx={{ textAlign: "justify", pt: "2rem" }}>{article.content}</Box>
            </Box>
        </Container>
    );
};

export default ArticlePage;
