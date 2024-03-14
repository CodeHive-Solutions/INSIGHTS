// Material-UI
import { Box, Typography } from "@mui/material";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../../index.css";

// Media
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

const SwiperSlider = () => {
    return (
        <Swiper
            style={{ width: "100%", height: "max-content", padding: "2rem", userSelect: "none" }}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            slidesPerView={3}
            spaceBetween={30}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
        >
            {managersJr.map((manager, index) => (
                <SwiperSlide key={index}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "white",
                            borderRadius: "10px",
                            padding: "3rem",
                        }}
                    >
                        <img
                            src={manager.image}
                            alt={manager.name}
                            style={{
                                width: "100%",
                                maxWidth: "350px",
                                borderRadius: "5%",
                                objectFit: "cover",
                            }}
                        />
                        <Box sx={{ mt: "1rem", textAlign: "center" }}>
                            <Typography variant="h4">{manager.name}</Typography>
                            <Typography variant="subtitle1">{manager.management}</Typography>
                        </Box>
                    </Box>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SwiperSlider;
