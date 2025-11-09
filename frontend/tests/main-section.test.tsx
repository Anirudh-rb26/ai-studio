import MainSection from "@/app/home/main-section";
import { render, screen } from '@testing-library/react';


const mockOnGenerationSuccess = jest.fn();
const mockOnClearGeneration = jest.fn();

describe("MainSection", () => {
    it("renders input fields and buttons", () => {
        render(<MainSection onGenerationSuccess={mockOnGenerationSuccess} currentGeneration={null} onClearGeneration={mockOnClearGeneration} />);

        expect(screen.getByPlaceholderText(/Enter your prompt/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
        expect(screen.getByText(/Realistic|Artistic|Minimalist/)).toBeInTheDocument();
    });

    it("disables generate button when no image or prompt", () => {
        render(<MainSection onGenerationSuccess={mockOnGenerationSuccess} currentGeneration={null} onClearGeneration={mockOnClearGeneration} />);
        const generateButton = screen.getByRole("button", { name: "" }); // button with icon only

        expect(generateButton).toBeDisabled();
    });
});
