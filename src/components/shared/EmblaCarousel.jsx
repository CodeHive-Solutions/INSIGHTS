import React from "react";
import useEmblaCarousel from "embla-carousel-react";

export function EmblaCarousel() {
    const [emblaRef] = useEmblaCarousel();

    return (
        <div className="embla" style={{ overflow: "hidden" }} ref={emblaRef}>
            <div className="embla__container" style={{ display: "flex" }}>
                <div style={{ flex: "0 0 100%", minWidth: 0 }} className="embla__slide">
                    Slide 1
                </div>
                <div style={{ flex: "0 0 100%", minWidth: 0 }} className="embla__slide">
                    Slide 2
                </div>
                <div style={{ flex: "0 0 100%", minWidth: 0 }} className="embla__slide">
                    Slide 3
                </div>
            </div>
        </div>
    );
}
