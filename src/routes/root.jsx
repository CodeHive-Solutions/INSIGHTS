import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Container } from "@mui/material";
import Footer from "../components/Footer";

const Root = () => {
    return (
        <>
            <NavBar />
            <Container sx={{ paddingTop: "74px" }}>
                <Outlet />
            </Container>
            <Footer />
        </>
    );
};

export default Root;
