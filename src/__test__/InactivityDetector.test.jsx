import { render } from "@testing-library/react";
import { vi } from "vitest";
import InactivityDetector from "../components/shared/InactivityDetector";

describe("InactivityDetector Component", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.restoreAllMocks();
    });

    test("calls handleLogout after inactivity period", () => {
        const handleLogoutMock = vi.fn();
        render(<InactivityDetector handleLogout={handleLogoutMock} />);

        // Fast-forward time to simulate inactivity
        vi.advanceTimersByTime(150000);

        expect(handleLogoutMock).toHaveBeenCalledWith(true);
    });

    test("resets inactivity timeout on user activity", () => {
        const handleLogoutMock = vi.fn();
        render(<InactivityDetector handleLogout={handleLogoutMock} />);

        // Simulate user activity
        window.dispatchEvent(new Event("mousemove"));

        // Fast-forward time to just before the inactivity timeout
        vi.advanceTimersByTime(149000);

        expect(handleLogoutMock).not.toHaveBeenCalled();

        // Simulate more user activity
        window.dispatchEvent(new Event("keydown"));

        // Fast-forward time again to just before the inactivity timeout
        vi.advanceTimersByTime(149000);

        expect(handleLogoutMock).not.toHaveBeenCalled();

        // Fast-forward time to exceed the inactivity timeout
        vi.advanceTimersByTime(2000);

        expect(handleLogoutMock).toHaveBeenCalledWith(true);
    });

    test("cleans up event listeners on unmount", () => {
        const handleLogoutMock = vi.fn();
        const { unmount } = render(<InactivityDetector handleLogout={handleLogoutMock} />);

        const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith("click", expect.any(Function));
    });
});
