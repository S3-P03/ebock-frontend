import { fireEvent, render, screen } from "@testing-library/react"
import AddItemForm from "components/AddItemForm"
import { Category } from "interfaces/Category";
import { DeliveryOption } from "interfaces/DeliveryOption";
import { PaymentOption } from "interfaces/PaymentOption";
import { Tag } from "interfaces/Tag";
import { Wear } from "interfaces/Wear";
import * as authModule from "hooks/useAuthSession";
import * as itemService from "services/itemService";
import React from "react";

jest.mock("services/itemService");
jest.mock('hooks/useAuthSession');

const setupMockAuth = (logout = jest.fn()) => {
  const mockUseAuthSession = authModule.default as jest.Mock;
  mockUseAuthSession.mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    connectedUser: { cip: 'larj4236', email: 'larj4236@usherbrooke.ca' },
    token: 'test-token',
    login: jest.fn(),
    logout,
  });
};

const mockCategories = [
  { categoryId: 1, name: "Electronics" },
  { categoryId: 2, name: "Clothing" },
] as Category[];

const mockTags = [
  { tagId: 1, name: "New" },
  { tagId: 2, name: "Used" },
] as Tag[];

const mockWears = [
  { wearId: 1, name: "Like New" },
  { wearId: 2, name: "Good" },
] as Wear[];

const mockDeliveries = [
  { deliveryOptnId: 1, name: "Pickup" },
  { deliveryOptnId: 2, name: "Shipping" },
] as DeliveryOption[];

const mockPayments = [
  { paymentOptnId: 1, name: "Cash" },
  { paymentOptnId: 2, name: "Card" },
] as PaymentOption[];

const renderForm = () => {
    return render(<AddItemForm categories={mockCategories} tags={mockTags} wears={mockWears} deliveryOptions={mockDeliveries} paymentOptions={mockPayments}></AddItemForm>);
}

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AddItemForm Component", () => {
    beforeEach(() => {
    jest.clearAllMocks();
    setupMockAuth();
  });

  describe("Rendering", () => {
    test("renders title", () => {
        renderForm();
        expect(screen.getByText("Produits en vente")).toBeInTheDocument();
        expect(screen.getByText("Ajouter un produit")).toBeInTheDocument();
        expect(screen.getByText("Informations")).toBeInTheDocument();
    });

    test("renders fields", () => {
        renderForm();
        expect(screen.getByPlaceholderText("Nom du produit")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Rédigez une courte description de votre item...")).toBeInTheDocument();
        expect(screen.getByText("Prix et quantité")).toBeInTheDocument();
        expect(screen.getByText("Quantité")).toBeInTheDocument();
        expect(screen.getByText("Catégorie")).toBeInTheDocument();
        expect(screen.getByText("Spécifications")).toBeInTheDocument();
        expect(screen.getByText("Condition")).toBeInTheDocument();
        expect(screen.getByText("Options de livraison/ramassage *")).toBeInTheDocument();
        expect(screen.getByText("Tags")).toBeInTheDocument();
        expect(screen.getByText("Images *")).toBeInTheDocument();
    });
    
    test("renders buttons", () => {
        renderForm();
        expect(screen.getByText("Réinitialiser")).toBeInTheDocument();
        expect(screen.getByText("Ajouter le produit")).toBeInTheDocument();
    });
  });

  describe("Filling fields", () => {
    test("name", () => {
      renderForm();
      const input = screen.getByPlaceholderText("Nom du produit");
      fireEvent.change(input, { target: {value: "Nom test"}});
      expect(input).toHaveValue("Nom test")
    });

    test("description", () => {
      renderForm();
      const input = screen.getByPlaceholderText("Rédigez une courte description de votre item...");
      fireEvent.change(input, { target: {value: "Description testtest"}});
      expect(input).toHaveValue("Description testtest")
    });

    test("price", () => {
      renderForm();
      const input = screen.getByPlaceholderText("0.00");
      fireEvent.change(input, { target: {value: "15.00"}});
      expect(input).toHaveValue(15);
    });

    test("quantity", () => {
      renderForm();
      const input = screen.getByRole("spinbutton", { name: /quantité/i });
      fireEvent.change(input, { target: {value: "13"}});
      expect(input).toHaveValue(13);
    });
  });

  
  describe("Validation", () => {
    test("shows errors when submitting empty form", async () => {
      renderForm();

      fireEvent.click(screen.getByText("Ajouter le produit"));

      expect(await screen.findByText("Veuillez indiquer le nom du produit.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez fournir une description.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez entrer un prix valide.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez sélectionner une catégorie.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez sélectionner la condition de l'item.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez sélectionner au moins une option de ramassage ou livraison.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez ajouter au moins une image du produit.")).toBeInTheDocument();
    });
  });

  describe("Reset", () => {
    test("resets form fields", () => {
      renderForm();

      const nameInput = screen.getByPlaceholderText("Nom du produit");

      fireEvent.change(nameInput, { target: { value: "Test product" } });
      expect(nameInput).toHaveValue("Test product");

      fireEvent.click(screen.getByText("Réinitialiser"));

      expect(nameInput).toHaveValue("");
    });
  });
});