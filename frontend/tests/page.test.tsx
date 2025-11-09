import Home from "@/app/page";
import '@testing-library/jest-dom';
import { describe, it, expect } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

const mockSignup = jest.fn();
const mockLogin = jest.fn();

jest.mock("@/lib/api", () => ({
    authApi: {
        signup: (email: string, password: string) => mockSignup(email, password),
        login: (email: string, password: string) => mockLogin(email, password),
    },
}));

describe("Auth Page", () => {
    beforeEach(() => {
        mockSignup.mockReset();
        mockLogin.mockReset();
    });

    it("renders login form initially", () => {
        render(<Home />);
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("E-Mail Address")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });

    it("toggles to signup mode", () => {
        render(<Home />);
        fireEvent.click(screen.getByText("Create an Account"));
        expect(screen.getByText("Signup")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    });

    it("validates email and password fields", async () => {
        render(<Home />);
        fireEvent.click(screen.getByText("Login"));

        expect(await screen.findByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    it("handles successful login", async () => {
        mockLogin.mockResolvedValue({ token: "mocked-token" });
        render(<Home />);
        fireEvent.change(screen.getByPlaceholderText("E-Mail Address"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123"));
        expect(localStorage.getItem("token")).toBe("mocked-token");
    });

    it("shows error on failed login", async () => {
        mockLogin.mockRejectedValue(new Error("Invalid credentials"));
        render(<Home />);
        fireEvent.change(screen.getByPlaceholderText("E-Mail Address"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpassword" } });
        fireEvent.click(screen.getByText("Login"));

        expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    });
});
