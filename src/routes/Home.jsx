import React from "react";
import CarouselComponent from "../components/Carousel";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography, Button, Box } from "@mui/material";

const Home = () => {
    return (
        <>
            <CarouselComponent></CarouselComponent>
            <Box>
                <Typography variant="h3" color="primary" sx={{ display: "flex", width: "100%", justifyContent: "center", padding: "1em" }}>
                    Cumpleaños
                </Typography>
            </Box>
            <Box sx={{ widht: "100%", display: "flex" }}>
                <Typography variant="h4" color="primary" sx={{ display: "flex", width: "100%", justifyContent: "center", padding: "1em" }}>
                    Ayer
                </Typography>
                <Typography variant="h4" color="primary" sx={{ display: "flex", width: "100%", justifyContent: "center", padding: "1em" }}>
                    Hoy
                </Typography>
                <Typography variant="h4" color="primary" sx={{ display: "flex", width: "100%", justifyContent: "center", padding: "1em" }}>
                    Mañana
                </Typography>
            </Box>
            <Box sx={{ display: "flex", widht: "100%", justifyContent: "space-between" }}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Juan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac risus vel risus vulputate pellentesque. Mauris rhoncus scelerisque nisi, eu
                            sollicitudin lacus vestibulum eu. Aenean sed augue eu felis luctus ullamcorper eu vel erat. Sed sed diam at diam convallis faucibus. Fusce
                            euismod, elit ut vestibulum malesuada, nibh lectus int
                        </Typography>
                    </CardContent>
                </Card>{" "}
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="https://images.pexels.com/photos/3715457/pexels-photo-3715457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Camila
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac risus vel risus vulputate pellentesque. Mauris rhoncus scelerisque nisi, eu
                            sollicitudin lacus vestibulum eu. Aenean sed augue eu felis luctus ullamcorper eu vel erat. Sed sed diam at diam convallis faucibus. Fusce
                            euismod, elit ut vestibulum malesuada, nibh lectus int
                        </Typography>
                    </CardContent>
                </Card>{" "}
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia sx={{ height: 140 }} image="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" title="green iguana" />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Jessica
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac risus vel risus vulputate pellentesque. Mauris rhoncus scelerisque nisi, eu
                            sollicitudin lacus vestibulum eu. Aenean sed augue eu felis luctus ullamcorper eu vel erat. Sed sed diam at diam convallis faucibus. Fusce
                            euismod, elit ut vestibulum malesuada, nibh lectus int
                        </Typography>
                    </CardContent>
                </Card>{" "}
            </Box>
        </>
    );
};

export default Home;
