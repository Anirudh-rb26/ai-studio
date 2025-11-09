import { render, screen } from '@testing-library/react';
import SidebarSection from "@/app/home/sidebar-section";


const generationsMock = [
    { id: 1, prompt: "Test prompt 1", style: "realistic", imageUrl: "/image1.png" },
    { id: 2, prompt: "Test prompt 2", style: "artistic", imageUrl: "/image2.png" },
];

describe("SidebarSection", () => {
    it("renders history title and generations", () => {
        render(<SidebarSection generations={generationsMock} isLoading={false} onSelectGeneration={jest.fn()} />);
        expect(screen.getByText("History")).toBeInTheDocument();
        expect(screen.getByText("Test prompt 1")).toBeInTheDocument();
        expect(screen.getByText("Test prompt 2")).toBeInTheDocument();
    });

    it("shows loading spinner when loading", () => {
        render(<SidebarSection generations={[]} isLoading={true} onSelectGeneration={jest.fn()} />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument(); // Spinner role might need adjustment depending on UI
    });
});
