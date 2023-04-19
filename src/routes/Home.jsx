import React from "react";
import { Box, Container } from "@mui/material";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <>
            <NavBar />
            <Container>
                <Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }} />
            </Container>
            <Footer />
        </>
    );
};

export default Home;
