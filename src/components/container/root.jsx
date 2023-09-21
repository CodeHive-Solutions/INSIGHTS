import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../common/NavBar";
import { Container } from "@mui/material";
import Footer from "../common/Footer";
import { useEffect } from "react";

const Root = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
};

export default Root;
