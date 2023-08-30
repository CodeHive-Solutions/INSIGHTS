import { useNavigate } from "react-router-dom";

const ScrollToTop = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [navigate]);

    return null;
};

export default ScrollToTop;
