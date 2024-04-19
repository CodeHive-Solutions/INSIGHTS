import { useEffect } from "react";

const InactivityDetector = ({ handleLogout }) => {
    useEffect(() => {
        let inactivityTimeout;

        const resetInactivityTimeout = () => {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                handleLogout();
            }, 150000); // Adjust the timeout value as needed (in milliseconds)
        }; 

        const handleActivity = () => {
            console.log("User activity detected");
            resetInactivityTimeout();
        };

        // Add event listeners to detect user activity
        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);
        window.addEventListener("scroll", handleActivity);
        window.addEventListener("click", handleActivity);

        // Start the inactivity timeout on component mount
        resetInactivityTimeout();

        // Clean up event listeners on component unmount
        return () => {
            clearTimeout(inactivityTimeout);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("scroll", handleActivity);
            window.removeEventListener("click", handleActivity);
            window.removeEventListener("keydown", handleActivity);
        };
    }, []);
};

export default InactivityDetector;
