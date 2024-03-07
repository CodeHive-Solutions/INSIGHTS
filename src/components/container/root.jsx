// Libraries
import { Outlet } from "react-router-dom";

// Custom Components
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

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
