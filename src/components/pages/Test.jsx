import React, { useEffect } from "react";
import { motion, useIsPresent } from "framer-motion";
import { useNavigate, Link, useMatch } from "react-router-dom";

function Test() {
    const isPresent = useIsPresent();

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/logged/home");
    };

    return (
        <div>
            <li>
                <Link to="/logged/home">Amsterdam</Link>
            </li>
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
                exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
                style={{ originX: isPresent ? 0 : 1 }}
                className="privacy-screen"
            />
            <button onClick={() => handleNavigate()}>Transition</button>
            <h1>Hello, React!</h1>
            <p>This is a basic React.js component.</p>
        </div>
    );
}

export default Test;
