import React from "react";
import CarouselComponent from "../components/Carousel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography, Box } from "@mui/material";
import imageExample from "../images/example-image.jpg";
import imageExample2 from "../images/example-image2.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";

const Home = () => {
    const homeImages = [
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true" },
        { image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true" },
    ];

    return (
        <>
            <CarouselComponent items={homeImages} height={"80vh"} widht={"100%"} />
            <Box>
                <Typography color="primary" sx={{ display: "flex", width: "100%", justifyContent: "center", padding: "1em", fontWeight: 600, fontSize: "30px" }}>
                    Cumpleaños
                </Typography>
            </Box>
            <Box sx={{ display: "flex", width: "100%", justifyContent: "center", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <Card sx={{ maxWidth: 350, width: 350, height: 500 }}>
                    <Typography variant="h4" color="primary" sx={{ display: "flex", width: "100%", justifyContent: "center", padding: "0.5rem" }}>
                        Ayer
                    </Typography>
                    <CardMedia sx={{ height: 350 }} image={image2} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Juan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Area de tecnologia
                        </Typography>
                    </CardContent>
                </Card>{" "}
                <Card sx={{ maxWidth: 350, width: 350, height: 500 }}>
                    <Typography variant="h4" color="primary" sx={{ display: "flex", width: "100%", justifyContent: "center", padding: "0.5rem" }}>
                        Hoy
                    </Typography>
                    <CardMedia sx={{ height: 350 }} image={imageExample2} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Camila
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Falabella
                        </Typography>
                    </CardContent>
                </Card>{" "}
                <Card sx={{ maxWidth: 350, width: 350, height: 500 }}>
                    <Typography variant="h4" color="primary" sx={{ display: "flex", width: "100%", justifyContent: "center", padding: "0.5rem" }}>
                        Mañana
                    </Typography>
                    <CardMedia sx={{ height: 350 }} image={image3} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Jessica
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Claro
                        </Typography>
                    </CardContent>
                </Card>{" "}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-around", py: "5rem", flexWrap: "wrap" }}>
                <CarouselComponent items={homeImages} height={"80vh"} width={"45%"} />
                <CarouselComponent items={homeImages} height={"80vh"} width={"45%"} />
            </Box>
        </>
    );
};

export default Home;
