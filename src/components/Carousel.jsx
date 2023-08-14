import React from "react";
import Carousel from "react-material-ui-carousel";
import { Box } from "@mui/material";

function CarouselComponent(props) {
    const { items, height, width } = props;

    return (
        <Carousel sx={{ width: width}}>
            {items.map((item, i) => (
                <Item key={i} item={item} height={height} />
            ))}
        </Carousel>
    );
}

function Item(props) {
    const { item, height, width } = props;
    const { name, description, image } = item;

    return (
        <Box>
            <Box
                sx={{
                    height: height,
                    width: width,
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
