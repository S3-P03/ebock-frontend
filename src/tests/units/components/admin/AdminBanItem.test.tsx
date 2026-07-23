import { render, screen, fireEvent } from "@testing-library/react";
import AdminBanItem from "components/admin/AdminBanItem";

jest.mock("react-oidc-context", () => ({
    useAuth: () => ({
        isAuthenticated: true,
        isLoading: false,
        user: {
            profile: {
                cip: "12345",
                email: "test.user@example.com",
            },
            access_token: "fake-access-token",
        },
        signinRedirect: jest.fn(),
        signoutRedirect: jest.fn(),
    }),
}));

describe("AdminBanItem", () => {
    test("affiche le formulaire", () => {
        render(<AdminBanItem />);

        expect(screen.getByText("Bannir un item")).toBeInTheDocument();
        expect(screen.getByLabelText("ID de l'item")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Bannir l'item" })
        ).toBeInTheDocument();
    });

    test("permet de saisir un identifiant", () => {
        render(<AdminBanItem />);

        const input = screen.getByLabelText("ID de l'item");

        fireEvent.change(input, {
            target: { value: "123" },
        });

        expect(input).toHaveValue("123");
    });

});