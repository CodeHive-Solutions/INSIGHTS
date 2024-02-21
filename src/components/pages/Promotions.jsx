import React from "react";
import { Box, Card, Typography, Container } from "@mui/material";
import CarouselComponent from "../shared/Carousel";

const Promotions = () => {
    return (
        <Container sx={{ mt: "5rem" }}>
            <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }} variant={"h4"}>
                Plan Carrera
            </Typography>{" "}
            <Card sx={{ maxWidth: 350, width: 350, height: 700 }}>
                {/* <CarouselComponent contain={true} items={yesterdayBirthdays} day={"Ayer"} height={"280px"} width={"100%"} /> */}
            </Card>
        </Container>
    );
};

export default Promotions;
