import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Carousel.css"; // Import custom CSS for carousel styling
import carouselImage1 from "./carouselImage1.jpg";
import carouselImage2 from "./carouselImage2.jpg";
import carouselImage3 from "./carouselImage3.jpg";

const Carousell = () => {
    return (
        <Carousel>
            <div>
                <img src={carouselImage1} alt="Image 1" />
                <p className="legend">Image 1</p>
            </div>
            <div>
                <img src={carouselImage2} alt="Image 2" />
                <p className="legend">Image 2</p>
            </div>
            <div>
                <img src={carouselImage3} alt="Image 3" />
                <p className="legend">Image 3</p>
            </div>
        </Carousel>
    );
};

export default Carousell;
