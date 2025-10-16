import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Set global timeout for all tests
vi.setConfig({ testTimeout: 5000 });

// Mock all dependencies before importing the component
vi.mock("../../store/store", () => ({
    useStore: () => ({
        isMuted: false,
        isOpen: true,
    }),
}));

vi.mock("../../hooks/audio", () => ({
    useAudio: () => [null, null, vi.fn()],
}));

vi.mock("react-router", () => ({
    NavLink: ({ children, to, title, onClick }: any) => (
        <a href={to} title={title} onClick={onClick} data-testid="logo-link">
            {children}
        </a>
    ),
}));

vi.mock("../../../../resources/duck-quacking.mp3?no-inline", () => ({
    default: "mock-audio-file.mp3",
}));

vi.mock("../../../../resources/erpel.png?no-inline", () => ({
    default: "mock-icon.png",
}));

import { render, screen } from "@testing-library/react";
import { Logo } from "./logo";

describe("Logo", () => {
    beforeEach(() => {
        cleanup();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders the logo component", () => {
        render(<Logo />);
        expect(screen.getByTestId("logo-link")).toBeInTheDocument();
    });

    it("renders with correct title", () => {
        render(<Logo />);
        const logoLink = screen.getByTestId("logo-link");
        expect(logoLink).toHaveAttribute("title", "erpel");
    });

    it("renders with correct href", () => {
        render(<Logo />);
        const logoLink = screen.getByTestId("logo-link");
        expect(logoLink).toHaveAttribute("href", "/");
    });

    it("renders logo image", () => {
        render(<Logo />);
        const logoImage = screen.getByAltText("erpel");
        expect(logoImage).toBeInTheDocument();
    });
});