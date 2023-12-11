import { useNavigate } from "react-router-dom";

const sessionRequest = async () => {
    const navigate = useNavigate();
    
    try {
        const response = await fetch("https://insights-api-dev.cyc-bpo.com", {
            method,
            credentials: "include",
            headers: { "Content-Type": contentType },
            body: data,
        });
        
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.detail);
        }
        return responseData;
    } catch (error) {
        navigate("/");
        throw error;
    }
};

export default sessionRequest;
