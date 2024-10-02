import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/common/Footer';

describe('Footer Component', () => {
    test('renders company address and current year', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        expect(
            screen.getByText(
                /Calle 19 No. 3 - 16 Piso 3CC Barichara - Bogotá D. C./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                new RegExp(`© 2010 - ${new Date().getFullYear()}`)
            )
        ).toBeInTheDocument();
    });

    test('renders social media icons and they are clickable', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        const webIcon = screen.getByTestId('WebIcon');
        const facebookIcon = screen.getByTestId('FacebookOutlinedIcon');
        const linkedInIcon = screen.getByTestId('LinkedInIcon');

        expect(webIcon).toBeInTheDocument();
        expect(facebookIcon).toBeInTheDocument();
        expect(linkedInIcon).toBeInTheDocument();

        userEvent.click(webIcon);
        userEvent.click(facebookIcon);
        userEvent.click(linkedInIcon);
    });

    test('renders navigation links and they are clickable', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        const aboutUsLink = screen.getByText(/Sobre Nosotros/i);
        const blogLink = screen.getByText(/Blog/i);
        const sgcLink = screen.getByText(/Gestión Documental/i);
        const vacanciesLink = screen.getByText(/Vacantes/i);

        expect(aboutUsLink).toBeInTheDocument();
        expect(blogLink).toBeInTheDocument();
        expect(sgcLink).toBeInTheDocument();
        expect(vacanciesLink).toBeInTheDocument();

        userEvent.click(aboutUsLink);
        userEvent.click(blogLink);
        userEvent.click(sgcLink);
        userEvent.click(vacanciesLink);
    });
});
