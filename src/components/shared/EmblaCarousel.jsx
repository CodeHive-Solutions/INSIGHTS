// Libraries
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Images
import depression from "../../images/home-carousel/depression.png";
import password from "../../images/home-carousel/password.png";
import water from "../../images/home-carousel/water.png";

export function EmblaCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);

    return (
        <div className="embla" style={{ overflow: "hidden", padding: "2rem" }} ref={emblaRef}>
            <div className="embla__container" style={{ display: "flex", maxWidth: "1280px" }}>
                <div style={{ flex: "0 0 100%", minWidth: 0, maxWidth: "100%", margin: "20px 20px 0 0" }} className="embla__slide">
                    <img width={"100%"} style={{ borderRadius: "1.8rem" }} src={depression} alt="depression" />
                </div>
                <div style={{ flex: "0 0 100%", minWidth: 0, maxWidth: "100%", margin: "20px 20px 0 0" }} className="embla__slide">
                    <img width={"100%"} style={{ borderRadius: "1.8rem" }} src={password} alt="password" />
                </div>
                <div style={{ flex: "0 0 100%", minWidth: 0, maxWidth: "100%", margin: "20px 20px 0 0" }} className="embla__slide">
                    <img width={"100%"} style={{ borderRadius: "1.8rem" }} src={water} alt="water" />
                </div>
            </div>
        </div>
    );
}
