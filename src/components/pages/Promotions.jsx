import React, { s1q } from "react";
import { Box, Card, Typography, Container } from "@mui/material";
import CarouselComponent from "../shared/Carousel";

const Promotions = () => {
     
    const fetchImages = async (employees) => {
        const imagePromises = employees.map(async (employee) => {
            try {
                const imageResponse = await fetch(`${getApiUrl(true)}profile-picture/${employee.cedula}`, {
                    method: "GET",
                });

                const fullName = employee.nombre;

                // Split the full name into individual names and last names
                const nameParts = fullName.split(" ");

                // Extract the first name
                const firstName = nameParts.length === 2 ? nameParts[1] : nameParts.length > 2 ? nameParts[2] : "";

                // Extract the first last name (if exists)
                const firstLastName = nameParts.length > 0 ? nameParts[0] : "";

                // Create the formatted name
                const formattedName = `${firstName} ${firstLastName}`.trim();

                // Check if the image is found (status 200) and return the image URL
                if (imageResponse.status === 200) {
                    return {
                        image: `${getApiUrl(true)}profile-picture/${employee.cedula}`,
                        name: formattedName,
                        subtitle: employee.campana_general,
                        description: employee.descripcion,
                    };
                }

                // If image not found, return null
                return {
                    image: Avatar,
                    name: formattedName,
                    subtitle: employee.campana_general,
                    description: employee.descripcion,
                };
            } catch (error) {
                return null; // Handle fetch errors by returning null
            }
        });

        return (await Promise.all(imagePromises)).filter((image) => image !== null);
    };

    const getBirthdaysId = async () => {
        try {
            const response = await fetch(`${getApiUrl(true)}profile-picture/birthday`, {
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    return;
                }
                throw new Error(data.detail);
            }

            if (response.status === 200) {
                const yesterdayBirthdays = data.data.yesterday;
                const todayBirthdays = data.data.today;
                const tomorrowBirthdays = data.data.tomorrow;

                const yesterdayImages = await fetchImages(yesterdayBirthdays);
                const todayImages = await fetchImages(todayBirthdays);
                const tomorrowImages = await fetchImages(tomorrowBirthdays);

                setYesterdayBirthdays(yesterdayImages);
                setTodayBirthdays(todayImages);
                setTomorrowBirthdays(tomorrowImages);
            }
        } catch (error) {
            showSnack("error", error.message);
            console.error(error);
        }
    };

    useEffect(() => {
        getBirthdaysId();
        window.scrollTo(0, 0);
    }, []);

    return (
        <Container sx={{ mt: "5rem" }}>
            <Typography sx={{ textAlign: "center", pb: "15px", color: "primary.main", fontWeight: "500" }} variant={"h4"}>
                Plan Carrera
            </Typography>{" "}
            <Card sx={{ maxWidth: 350, width: 350, height: 700 }}>
                {/* <CarouselComponent contain={true} items={yesterdayBirthdays} day={"Ayer"} height={"280px"} width={"100%"} /> */}
            </Card>
        </Container>
    );
};

export default Promotions;
