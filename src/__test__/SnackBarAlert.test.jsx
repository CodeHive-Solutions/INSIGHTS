import { render, screen, fireEvent } from "@testing-library/react";
import SnackbarAlert from "../components/common/SnackBarAlert";

describe("SnackbarAlert Component", () => {
    test("renders SnackbarAlert with message and severity", () => {
        render(<SnackbarAlert message="Test Message" severity="success" openSnack={true} closeSnack={() => {}} />);
        expect(screen.getByText("Test Message")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardSuccess");
    });

    test("renders SnackbarAlert with action button", () => {
        render(<SnackbarAlert message="Test Message" severity="info" openSnack={true} closeSnack={() => {}} action={true} />);
        expect(screen.getByText("Test Message")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /aceptar/i })).toBeInTheDocument();
    });

    test("calls closeSnack function when close button is clicked", () => {
        const closeSnackMock = vi.fn();
        render(<SnackbarAlert message="Test Message" severity="error" openSnack={true} closeSnack={closeSnackMock} />);
        fireEvent.click(screen.getByRole("button", { name: /close/i }));
        expect(closeSnackMock).toHaveBeenCalledTimes(1);
    });
});
