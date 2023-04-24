import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, Box, Typography } from "@mui/material";

function CarouselComponent(props) {
    var items = [
        {
            image: "https://github.com/S-e-b-a-s/images/blob/main/image8.avif?raw=true",
        },
        {
            image: "https://github.com/S-e-b-a-s/images/blob/main/image9.avif?raw=true",
        },
        {
            image: "https://github.com/S-e-b-a-s/images/blob/main/image7.avif?raw=true",
        },
        {
            image: "https://github.com/S-e-b-a-s/images/blob/main/image6.avif?raw=true",
        },
    ];

    return (
        <Carousel>
            {items.map((item, i) => (
                <Item key={i} item={item} />
            ))}
        </Carousel>
    );
}

function Item(props) {
    const { item } = props;
    const { name, description, image } = item;

    return (
        <Box>
            <Box
                sx={{
                    height: "80vh",
                    width: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${image})`,
                    borderRadius: "15px",
                }}
            ></Box>
        </Box>
    );
}

export default CarouselComponent;
