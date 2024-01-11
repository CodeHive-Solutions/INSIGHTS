import React from "react";
import Carousel from "react-material-ui-carousel";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import videoURL from "../../videos/futbol.mp4";

function CarouselComponent(props) {
    const { items, height, width, day } = props;

    return (
        <Carousel sx={{ width: width }}>
            {items.map((item, i) => (
                <Item key={i} item={item} day={day} height={height} />
            ))}
        </Carousel>
    );
}

function Item(props) {
    const { item, height, width, day } = props;
    const { name, description, image, video } = item;
    if (video) {
        console.log("entrando video");
        return (
            <video style={{ borderRadius: "8px" }} controls width="90%" height="650px">
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    } else {
        return (
            <Box>
                <Box
                    sx={{
                        height: height,
                        width: width,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundImage: `url(${image})`,
                        borderRadius: "15px",
                    }}
                ></Box>
                <Box sx={{ padding: "10px" }}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {day}
                    </Typography>
                    <Typography gutterBottom variant="subtitle1" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </Box>
            </Box>
        );
    }
}

export default CarouselComponent;
