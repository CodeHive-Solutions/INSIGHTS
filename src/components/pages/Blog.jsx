import { useState, useEffect } from 'react';

// Libraries
import { useNavigate } from 'react-router-dom';

// Media
import article1 from '../../images/articles/article1.jpg';
import cybersecurity from '../../images/blog/cybersecurity.jpg';
import bienestar from '../../images/blog/bienestar.jpg';
import article5 from '../../images/blog/article5.jpg';
import sstManagement from '../../images/blog/sst-environment-management.jpg';
import carteraPropia from '../../images/blog/cartera-propia.jpg';
import youthFinances from '../../images/blog/youth-finances.jpg';

// Material-UI
import {
    Typography,
    Card,
    CardContent,
    CardMedia,
    Box,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    List,
    Collapse,
    Avatar,
} from '@mui/material';

// Icons
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const MediaCard = ({ title, subtitle, img, articleId }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
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
                <Typography gutterBottom variant="h5">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );
};

const baseArticles = [
    {
        title: 'Bienvenido a Finanzas Jóvenes: Tu Guía hacia el Éxito Financiero',
        subtitle:
            '¡Hola, lectores jóvenes y emprendedores de la comunidad C&C! Bienvenidos a Finanzas Jóvenes',
        img: youthFinances,
        articleId: 8,
        uploadDate: '02-2024',
    },
    {
        title: 'Desde Adentro: Cómo Nuestra Cartera Propia Define Nuestra Trayectoria en el BPO',
        subtitle:
            'Una Mirada Interna a Cómo la Gestión de la Cartera Eleva Nuestro Desempeño en el BPO',
        img: carteraPropia,
        articleId: 7,
        uploadDate: '01-2024',
    },
    {
        title: 'Elevando Nuestra Empresa: Certificaciones ISO 45001:2018 y 14001:2015',
        subtitle:
            'Alcanzando la Excelencia Empresarial: La Trascendencia de las Certificaciones ISO 45001:2018 y 14001:2015, el Impacto en Nuestra Organización y el Compromiso Fundamental de Nuestros Colaboradores',
        img: sstManagement,
        articleId: 6,
        uploadDate: '01-2024',
    },
    {
        title: 'C&C Services SAS avanza en proceso de certificación para elevar estándares de calidad en la industria de la cobranza',
        subtitle:
            'Compromiso con la excelencia: Un vistazo al proceso de certificación C&C de RACC.',
        img: article5,
        articleId: 5,
        uploadDate: '01-2024',
    },
    {
        title: 'Sumando Valor: Bienvenidos a las Nuevas Campañas en C&C Services S.A.S.',
        subtitle:
            'Uniendo Fuerzas para Alcanzar Nuevos Horizontes de Éxito y Crecimiento',
        img: article1,
        articleId: 1,
        uploadDate: '01-2024',
    },
    {
        title: 'Desarrollo Profesional en el Mundo del BPO',
        subtitle: 'C&C Services y la Ciberseguridad en la Era Actual',
        img: cybersecurity,
        articleId: 3,
        uploadDate: '01-2024',
    },
    {
        title: 'C&C Services: Innovación en el Bienestar Laboral para Empleados Productivos',
        subtitle:
            'Una Mirada Profunda a los Programas de Bienestar Integral y su Impacto en la Productividad y la Satisfacción Laboral',
        img: bienestar,
        articleId: 4,
        uploadDate: '01-2024',
    },
];

const Blog = () => {
    const [openYear, setOpenYear] = useState(null);
    const [articles, setArticles] = useState(baseArticles);
    // Extract unique years from uploadDate

    const handleClick = (year) => {
        setOpenYear(openYear === year ? null : year);
    };

    const years = [
        ...new Set(baseArticles.map((article) => article.uploadDate.slice(3))),
    ].sort();

    const getMonthsForYear = (year) => {
        return [
            ...new Set(
                baseArticles
                    .filter((article) => article.uploadDate.includes(year))
                    .map((article) =>
                        new Date(
                            `${year}-${article.uploadDate.slice(0, 2)}-02`
                        ).toLocaleString('default', { month: 'long' })
                    )
            ),
        ].sort();
    };

    const handleFilterMonth = (month) => {
        // Logic to filter articles by month
        const filteredArticles = baseArticles.filter((article) => {
            const articleMonth = new Date(
                `${openYear}-${article.uploadDate.slice(0, 2)}-02`
            ).toLocaleString('default', { month: 'long' });
            return articleMonth === month;
        });

        setArticles(filteredArticles);
    };

    return (
        <Box sx={{ minHeight: '100vh', height: '100%', mt: '5rem' }}>
            <Typography
                sx={{ textAlign: 'center', pb: '15px', color: 'primary.main' }}
                variant={'h4'}
            >
                Blog
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                }}
            >
                <List
                    sx={{
                        width: '100%',
                        maxWidth: 200,
                        bgcolor: 'background.paper',
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader
                            component="div"
                            id="nested-list-subheader"
                        >
                            Biblioteca de Artículos
                        </ListSubheader>
                    }
                >
                    {years.map((year) => (
                        <Box key={year}>
                            <ListItemButton
                                sx={{ borderRadius: '1rem' }}
                                onClick={() => handleClick(year)}
                            >
                                <ListItemIcon>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary={year} />
                                {openYear === year ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={openYear === year}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {getMonthsForYear(year).map((month) => (
                                        <ListItemButton
                                            onClick={() =>
                                                handleFilterMonth(month)
                                            }
                                            key={month}
                                            sx={{ pl: 4, borderRadius: '1rem' }}
                                        >
                                            <ListItemIcon>
                                                <CalendarMonthIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={month} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
                <Box
                    sx={{
                        width: '1500px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {articles.map((article, index) => {
                        return (
                            <MediaCard
                                title={article.title}
                                subtitle={article.subtitle}
                                img={article.img}
                                articleId={article.articleId}
                                key={index}
                            ></MediaCard>
                        );
                    }, [])}
                </Box>
            </Box>
        </Box>
    );
};

export default Blog;
