import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import depression from "../../images/home-carousel/depression.png";
import password from "../../images/home-carousel/password.png";
import water from "../../images/home-carousel/water.png";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

export function EmblaCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000, stopOnInteraction: false })], [Fade()]);

    return (
        <div className="embla" style={{ overflow: "hidden" }} ref={emblaRef}>
            <div className="embla__container" style={{ display: "flex", maxWidth: "1280px" }}>
                <div style={{ flex: "0 0 auto", minWidth: 0, maxWidth: "100%", margin: "20px 20px 0 0" }} className="embla__slide">
                    <img style={{ borderRadius: "1.8rem" }} src={depression} alt="depression" />
                </div>
                <div style={{ flex: "0 0 auto", minWidth: 0, maxWidth: "100%", margin: "20px 20px 0 0" }} className="embla__slide">
                    <img style={{ borderRadius: "1.8rem" }} src={password} alt="password" />
                </div>
                <div style={{ flex: "0 0 auto", minWidth: 0, maxWidth: "100%", margin: "20px 20px 0 0" }} className="embla__slide">
                    <img style={{ borderRadius: "1.8rem" }} src={water} alt="water" />
                </div>
            </div>
        </div>
    );
}
