import { render, screen } from "@testing-library/react";
import SwiperSlider from "../components/shared/SwiperSlider";

describe("SwiperSlider Component", () => {
    test("renders SwiperSlider with all managers", () => {
        render(<SwiperSlider />);
        const managerNames = [
            "Rodrigo Lozano",
            "Marcela Osorio",
            "Christian Moncaleano",
            "Adriana Barrera",
            "Katterene Castrillon",
            "Karen Romero",
            "Luis Pachon",
            "Luis Rodriguez",
            "Julio Cesar",
        ];

        managerNames.forEach((name) => {
            expect(screen.getByText(name)).toBeInTheDocument();
        });
    });

    test("renders SwiperSlider with correct number of slides", () => {
        render(<SwiperSlider />);
        const slides = screen.getAllByRole("listitem"); // Assuming each slide has a role of "listitem"
        expect(slides.length).toBe(9);
    });

    test("renders SwiperSlider with images", () => {
        render(<SwiperSlider />);
        const images = screen.getAllByRole("img");
        expect(images.length).toBe(9);
        images.forEach((img) => {
            expect(img).toHaveAttribute("src");
            expect(img).toHaveAttribute("alt");
        });
    });
});
