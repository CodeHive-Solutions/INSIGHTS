import { useState, useEffect } from "react";

// Libraries
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";

// Material-UI
import { Box, Typography } from "@mui/material";

function CarouselComponent(props) {
    const { items, height, width, contain, day } = props;

    return (
        <Carousel sx={{ width: width }}>
            {items.map((item, i) => (
                <Item contain={contain} key={i} item={item} day={day} height={height} />
            ))}
        </Carousel>
    );
}

function Item(props) {
    const { item, height, contain, width, day } = props;
    const { name, subtitle, image, description } = item;
    const [isVacancy, setIsVacancy] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const keywords = ["certification", "voting"];

        const isVacancy = keywords.some((keyword) => props.item.image.includes(keyword));
        setIsVacancy(isVacancy);
    }, [props.item.image]);

    const handleClickOpen = () => {
        const actions = {
            certification: () =>
                window.open(
                    "https://forms.office.com/Pages/ResponsePage.aspx?id=rzX48YdyU0SlZPyn7p-_Nk_7TEIRbNJJngg-c4MRdAFUNUg5RjdaRjRMTFA2WllINTJHS1ZWTFBCVS4u&origin=QRCode"
                ),
            voting: () => window.open("https://forms.office.com/r/wBgswxvUbH?origin=lprLink"),
        };

        for (const keyword of Object.keys(actions)) {
            if (isVacancy && props.item.image.includes(keyword)) {
                actions[keyword]();
                return;
            }
        }

        if (isVacancy) {
            navigate("/logged/vacancies/");
        }
    };

    return (
        <>
            <Box
                onClick={() => handleClickOpen()}
                sx={{
                    height: height,
                    width: width,
                    backgroundSize: contain ? "contain" : "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url(${image})`,
                    borderRadius: "15px",
                    cursor: isVacancy ? "pointer" : "default",
                }}
            ></Box>
            <Box sx={{ padding: "10px" }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {day}
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
                <Typography variant="body">{description}</Typography>
            </Box>
        </>
    );
}

export default CarouselComponent;
