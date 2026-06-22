import { render, screen } from "@testing-library/react";
import ItemMainInfoBox from "../../../components/ItemMainInfoBox";
import { DetailedItem } from "../../../interfaces/Item";

const mockItem: DetailedItem = {
  itemId: 1,
  name: "Manuel de chimie",
  price: 25.0,
  quantity: 10,
  description: "Bon état",
  category: "Livres",
  wear: "Bon",
  addedAt: "2024-03-15T10:00:00Z",
  deliveryOptions: ["En main propre", "Livraison"],
  paymentOptions: ["Virement", "Cash"],
  sellerCip: "larj4236",
  tags: []
};

const renderBox = (item: DetailedItem | null = mockItem) => {
  return render(<ItemMainInfoBox item={item} />);
};

describe("ItemMainInfoBox Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
    test("renders item name", () => {
      renderBox();
      expect(screen.getByText("Manuel de chimie")).toBeInTheDocument();
    });

    test("renders formatted price with two decimals and dollar sign", () => {
      renderBox();
      expect(screen.getByText("25.00$")).toBeInTheDocument();
    });

    test("renders item category", () => {
      renderBox();
      expect(screen.getByText("Livres")).toBeInTheDocument();
    });

    test("renders item description", () => {
      renderBox();
      expect(
        screen.getByText("Bon état")
      ).toBeInTheDocument();
    });
  });

  // Test Group 2: Price Formatting
  describe("Price Formatting", () => {
    test("whole number price -> shows two decimal places", () => {
      renderBox({ ...mockItem, price: 10 });
      expect(screen.getByText("10.00$")).toBeInTheDocument();
    });

    test("one decimal price -> padded to two decimal places", () => {
      renderBox({ ...mockItem, price: 9.5 });
      expect(screen.getByText("9.50$")).toBeInTheDocument();
    });

    test("zero price -> shows 0.00$", () => {
      renderBox({ ...mockItem, price: 0 });
      expect(screen.getByText("0.00$")).toBeInTheDocument();
    });
  });
});