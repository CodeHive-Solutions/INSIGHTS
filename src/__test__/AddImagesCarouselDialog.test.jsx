import { render, screen, fireEvent, within } from '@testing-library/react';
import AddImagesCarouselDialog from '../components/shared/AddImagesCarouselDialog';
import { getApiUrl } from '../assets/getApi';
import { handleError } from '../assets/handleError';
import { vi } from 'vitest';

vi.mock('../assets/getApi');
vi.mock('../assets/handleError');
vi.mock('react-filepond', () => {
    return {
        __esModule: true,
        FilePond: vi.fn(() => (
            <input
                accept="image/*"
                multiple
                name="filepond"
                type="file"
                data-testid="filepond-input"
            />
        )),
        registerPlugin: vi.fn(),
    };
});

describe('AddImagesCarouselDialog Component', () => {
    const mockSetOpenAddDialog = vi.fn();
    const mockGetCarouselImages = vi.fn();
    const mockSetImages = vi.fn();

    const defaultProps = {
        openAddDialog: true,
        setOpenAddDialog: mockSetOpenAddDialog,
        currentImages: [{ name: 'Image 1' }, { name: 'Image 2' }],
        getCarouselImages: mockGetCarouselImages,
        setImages: mockSetImages,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders AddImagesCarouselDialog with correct elements', () => {
        render(<AddImagesCarouselDialog {...defaultProps} />);

        expect(screen.getByText('Actualizar imagenes')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Añade la imagen que deseas mostrar en el carousel de la página principal.'
            )
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/Posición/i)).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
        expect(screen.getByText('Actualizar')).toBeInTheDocument();
    });

    it('handles form submission with valid data', async () => {
        getApiUrl.mockReturnValue({ apiUrl: 'http://localhost/' });
        handleError.mockResolvedValue();

        screen.debug();
        render(<AddImagesCarouselDialog {...defaultProps} />);

        // Simulate opening the dropdown
        const positionInput = screen.getByLabelText(/Posición/i);
        fireEvent.mouseDown(positionInput);

        const listbox = within(screen.getByRole('listbox'));
        const firstOption = listbox.getByText('1');
        fireEvent.click(firstOption);

        // Directly access the input using container.querySelector
        const fileInput = screen.getByTestId('filepond-input'); // Use testid from the mock

        const file = new File(['dummy content'], 'example.png', {
            type: 'image/png',
        });

        fireEvent.change(fileInput, { target: { files: [file] } });

        // Submit the form
        const submitButton = screen.getByText('Actualizar');
        fireEvent.click(submitButton);

        expect(mockSetOpenAddDialog).toHaveBeenCalledWith(false);
    });

    it('shows error when no image is added', () => {
        render(<AddImagesCarouselDialog {...defaultProps} />);

        const submitButton = screen.getByText('Actualizar');
        fireEvent.click(submitButton);

        expect(screen.getByText('Debes añadir una imagen')).toBeInTheDocument();
    });

    it('toggles link input visibility', () => {
        render(<AddImagesCarouselDialog {...defaultProps} />);

        const checkbox = screen.getByLabelText(
            /¿La imagen debería redireccionar a un link?/i
        );
        fireEvent.click(checkbox);

        expect(screen.getByLabelText(/Link/)).toBeInTheDocument();
    });
});
