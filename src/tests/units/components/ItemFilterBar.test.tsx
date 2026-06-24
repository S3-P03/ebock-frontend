import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemFilterBar from "components/items/ItemFilterBar";
import * as categoryService from "services/categoryService";
import * as tagService from "services/tagService";
import * as wearService from "services/wearService";
import * as deliveryService from "services/deliveryOptionService";
import * as paymentService from "services/paymentOptionService";

jest.mock("services/categoryService");
jest.mock("services/tagService");
jest.mock("services/wearService");
jest.mock("services/deliveryOptionService");
jest.mock("services/paymentOptionService");

const mockFiltersChange = jest.fn();

const mockCategories = [
  { categoryId: 1, name: "Electronics" },
  { categoryId: 2, name: "Clothing" },
];

const mockTags = [
  { tagId: 1, name: "New" },
  { tagId: 2, name: "Used" },
];

const mockWears = [
  { wearId: 1, name: "Like New" },
  { wearId: 2, name: "Good" },
];

const mockDeliveries = [
  { deliveryOptnId: 1, name: "Pickup" },
  { deliveryOptnId: 2, name: "Shipping" },
];

const mockPayments = [
  { paymentId: 1, name: "Cash" },
  { paymentId: 2, name: "Card" },
];

const setupMocks = () => {
  (categoryService.getCategoryList as jest.Mock).mockResolvedValue(mockCategories);
  (tagService.getTagList as jest.Mock).mockResolvedValue(mockTags);
  (wearService.getWearList as jest.Mock).mockResolvedValue(mockWears);
  (deliveryService.getDeliveryList as jest.Mock).mockResolvedValue(mockDeliveries);
  (paymentService.getPaymentList as jest.Mock).mockResolvedValue(mockPayments);
};

const renderItemFilterBar = (onFiltersChange = mockFiltersChange) => {
  return render(<ItemFilterBar onFiltersChange={onFiltersChange} />);
};

describe("ItemFilterBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  describe("Loading State", () => {
    test("displays loading spinner while fetching filter options", () => {
      (categoryService.getCategoryList as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderItemFilterBar();

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("fetches all filter options on mount", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(categoryService.getCategoryList).toHaveBeenCalled();
        expect(tagService.getTagList).toHaveBeenCalled();
        expect(wearService.getWearList).toHaveBeenCalled();
        expect(deliveryService.getDeliveryList).toHaveBeenCalled();
        expect(paymentService.getPaymentList).toHaveBeenCalled();
      });
    });
  });

  describe("Rendering", () => {
    test("renders filter title", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByText("Filtres")).toBeInTheDocument();
      });
    });

    test("renders all price input fields", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Prix minimum ($)")).toBeInTheDocument();
        expect(screen.getByLabelText("Prix maximum ($)")).toBeInTheDocument();
      });
    });

    test("renders distance input field", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Distance maximale (km)")).toBeInTheDocument();
      });
    });

    test("renders favorites checkbox", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Favoris seulement")).toBeInTheDocument();
      });
    });

    test("renders all dropdown filters", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Catégories")).toBeInTheDocument();
        expect(screen.getByLabelText("Tags")).toBeInTheDocument();
        expect(screen.getByLabelText("États")).toBeInTheDocument();
        expect(screen.getByLabelText("Options de livraison")).toBeInTheDocument();
        expect(screen.getByLabelText("Modes de paiement")).toBeInTheDocument();
      });
    });

    test("renders apply and reset buttons", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Appliquer les filtres/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Réinitialiser/i })).toBeInTheDocument();
      });
    });
  });

  describe("Price Filters", () => {
    test("updates min price input", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Prix minimum ($)")).toBeInTheDocument();
      });

      const minPriceInput = screen.getByLabelText("Prix minimum ($)") as HTMLInputElement;
      fireEvent.change(minPriceInput, { target: { value: "50" } });

      expect(minPriceInput.value).toBe("50");
    });

    test("updates max price input", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Prix maximum ($)")).toBeInTheDocument();
      });

      const maxPriceInput = screen.getByLabelText("Prix maximum ($)") as HTMLInputElement;
      fireEvent.change(maxPriceInput, { target: { value: "200" } });

      expect(maxPriceInput.value).toBe("200");
    });
  });

  describe("Distance Filter", () => {
    test("updates distance input", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Distance maximale (km)")).toBeInTheDocument();
      });

      const distanceInput = screen.getByLabelText("Distance maximale (km)") as HTMLInputElement;
      fireEvent.change(distanceInput, { target: { value: "30" } });

      expect(distanceInput.value).toBe("30");
    });
  });

  describe("Favorites Checkbox", () => {
    test("toggles favorites checkbox", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Favoris seulement")).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText("Favoris seulement") as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  });

  describe("Apply Filters", () => {
    test("calls onFiltersChange with all selected filters", async () => {
      const onFiltersChange = jest.fn();
      renderItemFilterBar(onFiltersChange);

      await waitFor(() => {
        expect(screen.getByLabelText("Prix minimum ($)")).toBeInTheDocument();
      });

      const minPriceInput = screen.getByLabelText("Prix minimum ($)") as HTMLInputElement;
      fireEvent.change(minPriceInput, { target: { value: "50" } });

      const maxPriceInput = screen.getByLabelText("Prix maximum ($)") as HTMLInputElement;
      fireEvent.change(maxPriceInput, { target: { value: "200" } });

      const distanceInput = screen.getByLabelText("Distance maximale (km)") as HTMLInputElement;
      fireEvent.change(distanceInput, { target: { value: "30" } });

      const applyButton = screen.getByRole("button", { name: /Appliquer les filtres/i });
      fireEvent.click(applyButton);

      expect(onFiltersChange).toHaveBeenCalledWith({
        minP: 50,
        maxP: 200,
        maxD: 30,
      });
    });

    test("calls onFiltersChange with empty object when no filters selected", async () => {
      const onFiltersChange = jest.fn();
      renderItemFilterBar(onFiltersChange);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Appliquer les filtres/i })).toBeInTheDocument();
      });

      const applyButton = screen.getByRole("button", { name: /Appliquer les filtres/i });
      fireEvent.click(applyButton);

      expect(onFiltersChange).toHaveBeenCalledWith({});
    });

    test("includes favorites in filters when checked", async () => {
      const onFiltersChange = jest.fn();
      renderItemFilterBar(onFiltersChange);

      await waitFor(() => {
        expect(screen.getByLabelText("Favoris seulement")).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText("Favoris seulement") as HTMLInputElement;
      fireEvent.click(checkbox);

      const applyButton = screen.getByRole("button", { name: /Appliquer les filtres/i });
      fireEvent.click(applyButton);

      expect(onFiltersChange).toHaveBeenCalledWith({ fav: true });
    });
  });

  describe("Reset Filters", () => {
    test("clears all filter inputs on reset", async () => {
      const onFiltersChange = jest.fn();
      renderItemFilterBar(onFiltersChange);

      await waitFor(() => {
        expect(screen.getByLabelText("Prix minimum ($)")).toBeInTheDocument();
      });

      const minPriceInput = screen.getByLabelText("Prix minimum ($)") as HTMLInputElement;
      fireEvent.change(minPriceInput, { target: { value: "50" } });

      const maxPriceInput = screen.getByLabelText("Prix maximum ($)") as HTMLInputElement;
      fireEvent.change(maxPriceInput, { target: { value: "200" } });

      const resetButton = screen.getByRole("button", { name: /Réinitialiser/i });
      fireEvent.click(resetButton);

      expect(minPriceInput.value).toBe("");
      expect(maxPriceInput.value).toBe("");
    });

    test("calls onFiltersChange with empty object on reset", async () => {
      const onFiltersChange = jest.fn();
      renderItemFilterBar(onFiltersChange);

      await waitFor(() => {
        expect(screen.getByLabelText("Prix minimum ($)")).toBeInTheDocument();
      });

      const minPriceInput = screen.getByLabelText("Prix minimum ($)") as HTMLInputElement;
      fireEvent.change(minPriceInput, { target: { value: "50" } });

      const resetButton = screen.getByRole("button", { name: /Réinitialiser/i });
      fireEvent.click(resetButton);

      expect(onFiltersChange).toHaveBeenLastCalledWith({});
    });

    test("unchecks favorites checkbox on reset", async () => {
      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Favoris seulement")).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText("Favoris seulement") as HTMLInputElement;
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);

      const resetButton = screen.getByRole("button", { name: /Réinitialiser/i });
      fireEvent.click(resetButton);

      expect(checkbox.checked).toBe(false);
    });
  });

  describe("Error Handling", () => {
    test("handles category fetch error gracefully", async () => {
      (categoryService.getCategoryList as jest.Mock).mockRejectedValue(new Error("API error"));

      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Catégories")).toBeInTheDocument();
      });

      // Should still render with empty category list
      expect(screen.getByLabelText("Catégories")).toBeInTheDocument();
    });

    test("handles all service fetch errors gracefully", async () => {
      (categoryService.getCategoryList as jest.Mock).mockRejectedValue(new Error("API error"));
      (tagService.getTagList as jest.Mock).mockRejectedValue(new Error("API error"));
      (wearService.getWearList as jest.Mock).mockRejectedValue(new Error("API error"));
      (deliveryService.getDeliveryList as jest.Mock).mockRejectedValue(new Error("API error"));
      (paymentService.getPaymentList as jest.Mock).mockRejectedValue(new Error("API error"));

      renderItemFilterBar();

      await waitFor(() => {
        expect(screen.getByLabelText("Catégories")).toBeInTheDocument();
      });

      // Should still be usable with number filters
      const minPriceInput = screen.getByLabelText("Prix minimum ($)") as HTMLInputElement;
      fireEvent.change(minPriceInput, { target: { value: "50" } });

      expect(minPriceInput.value).toBe("50");
    });
  });
});
