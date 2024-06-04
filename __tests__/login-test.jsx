import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../src/components/pages/Login";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

describe("Login component", () => {
    test("renders login form with username and password fields", () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        const usernameField = screen.getByLabelText("Usuario");
        const passwordField = screen.getByLabelText("Contraseña");
        expect(usernameField).toBeInTheDocument();
        expect(passwordField).toBeInTheDocument();
    });

    test("displays error message when submitting empty form", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        const submitButton = screen.getByRole("button", { name: "Iniciar Sesión" });
        fireEvent.click(submitButton);
        const errorMessage = await screen.findByText("Campo requerido");
        expect(errorMessage).toBeInTheDocument();
    });

    test("displays success message and navigates to home page when submitting valid form", async () => {
        const history = createMemoryHistory();

        render(
            <Router history={history}>
                <Login />
            </Router>
        );
        const usernameField = screen.getByLabelText("Usuario");
        const passwordField = screen.getByLabelText("Contraseña");
        const submitButton = screen.getByRole("button", { name: "Iniciar Sesión" });
        fireEvent.change(usernameField, { target: { value: "testuser" } });
        fireEvent.change(passwordField, { target: { value: "testpassword" } });
        fireEvent.click(submitButton);
        const successMessage = await screen.findByText("Inicio de sesión exitoso");
        expect(successMessage).toBeInTheDocument();
        expect(history.location.pathname).toBe("/logged/home");
    });
});
