import React from "react";
import { Box, Container } from "@mui/material";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CarouselComponent from "../components/Carousel";

const Home = () => {
    return (
        <>
            <NavBar />
            <Container sx={{ paddingTop: "74px" }}>
                <CarouselComponent></CarouselComponent>
            </Container>
            <Footer />
        </>
    );
};

export default Home;
