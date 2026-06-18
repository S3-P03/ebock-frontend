import { render, screen } from "@testing-library/react";
import ItemAdditionalInfoBox from "../../../components/ItemAdditionalInfoBox";
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
  return render(<ItemAdditionalInfoBox item={item} />);
};
 
describe("ItemAdditionalInfoBox Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
    test("renders wear label and value", () => {
      renderBox();
      expect(screen.getByText("État")).toBeInTheDocument();
      expect(screen.getByText("Bon")).toBeInTheDocument();
    });
 
    test("renders delivery section label", () => {
      renderBox();
      expect(screen.getByText("Ramassage/Livraison")).toBeInTheDocument();
    });
 
    test("renders payment section label", () => {
      renderBox();
      expect(screen.getByText("Paiement")).toBeInTheDocument();
    });
 
    test("renders published date label", () => {
      renderBox();
      expect(screen.getByText("Publié")).toBeInTheDocument();
    });
  });
 
  // Test Group 2: Delivery Options
  describe("Delivery Options", () => {
    test("renders first delivery option", () => {
      renderBox();
      expect(screen.getByText("En main propre")).toBeInTheDocument();
    });
 
    test("renders additional delivery options with dash prefix", () => {
      renderBox();
      expect(screen.getByText("- Livraison")).toBeInTheDocument();
    });
 
    test("single delivery option -> no dash prefix shown", () => {
      const itemOneDelivery = { ...mockItem, deliveryOptions: ["En main propre"] };
      renderBox(itemOneDelivery);
      expect(screen.getByText("En main propre")).toBeInTheDocument();
      expect(screen.queryByText("- En main propre")).not.toBeInTheDocument();
    });
  });
 
  // Test Group 3: Payment Options
  describe("Payment Options", () => {
    test("renders first payment option", () => {
      renderBox();
      expect(screen.getByText("Virement")).toBeInTheDocument();
    });
 
    test("renders additional payment options with dash prefix", () => {
      renderBox();
      expect(screen.getByText("- Cash")).toBeInTheDocument();
    });
 
    test("single payment option -> no dash prefix shown", () => {
      const itemOnePayment = { ...mockItem, paymentOptions: ["Virement"] };
      renderBox(itemOnePayment);
      expect(screen.getByText("Virement")).toBeInTheDocument();
      expect(screen.queryByText("- Virement")).not.toBeInTheDocument();
    });
  });
 
  // Test Group 4: Date Formatting
  describe("Date Formatting", () => {
    test("renders formatted date in French Canadian locale", () => {
      renderBox();
      // 2024-03-15 -> "15 mars 2024" in fr-CA
      expect(screen.getByText(/mars 2024/)).toBeInTheDocument();
    });
 
    test("null item -> no date rendered", () => {
      renderBox(null);
      expect(screen.queryByText(/2024/)).not.toBeInTheDocument();
    });
  });
 
  // Test Group 5: Null Handling
  describe("Null Item", () => {
    test("null item -> renders without crashing", () => {
      renderBox(null);
      expect(screen.getByText("DÉTAILS")).toBeInTheDocument();
    });
 
    test("null item -> section labels still visible", () => {
      renderBox(null);
      expect(screen.getByText("État")).toBeInTheDocument();
      expect(screen.getByText("Paiement")).toBeInTheDocument();
      expect(screen.getByText("Publié")).toBeInTheDocument();
    });
  });
});