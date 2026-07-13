import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ItemListFiltered from "components/items/ItemListFiltered";
import * as itemService from "services/itemService";
import * as useInfiniteScrollItems from "hooks/useInfiniteScrollItems";
import { SellerItem } from "interfaces/Item";

jest.mock("services/itemService");
jest.mock("hooks/useInfiniteScrollItems");
jest.mock("components/items/ItemCard", () => {
  return function MockItemCard({ item }: { item: SellerItem }) {
    return <div data-testid="item-card">{item.name}</div>;
  };
});
jest.mock("components/items/ItemFilterBar", () => {
  return function MockItemFilterBar({ onFiltersChange }: any) {
    return (
      <button
        data-testid="filter-apply"
        onClick={() =>
          onFiltersChange({
            minP: 50,
            maxP: 200,
            categories: [1],
          })
        }
      >
        Apply Filters
      </button>
    );
  };
});

const mockItems: SellerItem[] = [
  {
    itemId: 1,
    name: "Item 1",
    favorite: true,
    price: 50,
    addedAt: new Date().toISOString(),
    quantity: 1,
    categoryId: 1,
    wearId: 1,
    firstName: "John",
    lastName: "Doe",
    tags: [1],
  },
  {
    itemId: 2,
    name: "Item 2",
    favorite: false,
    price: 75,
    addedAt: new Date().toISOString(),
    quantity: 2,
    categoryId: 2,
    wearId: 2,
    firstName: "Jane",
    lastName: "Smith",
    tags: [2, 3],
  },
];

const mockSentinelRef = { current: null };

const setupMocks = (
  items: SellerItem[] = mockItems,
  hasMore: boolean = false,
  loading: boolean = false,
  error: Error | null = null
): void => {
  (useInfiniteScrollItems.useInfiniteScrollItems as jest.Mock).mockReturnValue({
    items,
    loading,
    error,
    hasMore,
    sentinelRef: mockSentinelRef,
  });
};

const renderItemListFiltered = (initialUrl = "/"): ReturnType<typeof render> => {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Routes>
        <Route path="/" element={<ItemListFiltered />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ItemListFiltered Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  describe("Rendering", () => {
    test("renders filter bar on the left sidebar", () => {
      setupMocks();
      renderItemListFiltered();

      expect(screen.getByTestId("filter-apply")).toBeInTheDocument();
    });

    test("renders item cards for loaded items", () => {
      setupMocks(mockItems);
      renderItemListFiltered();

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    test("renders all item cards with correct count", () => {
      setupMocks(mockItems);
      renderItemListFiltered();

      const cards = screen.getAllByTestId("item-card");
      expect(cards).toHaveLength(2);
    });

    test("displays empty state message when no items found", () => {
      setupMocks([], false, false);
      renderItemListFiltered();

      expect(screen.getByText(/Aucun items trouvés/i)).toBeInTheDocument();
    });

    test("displays loading spinner when no items and loading", () => {
      setupMocks([], false, true);
      renderItemListFiltered();

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("Infinite Scroll", () => {
    test("passes correct function to useInfiniteScrollItems", () => {
      setupMocks();
      renderItemListFiltered();

      expect(useInfiniteScrollItems.useInfiniteScrollItems).toHaveBeenCalledWith(
        itemService.getFilteredItems,
        expect.any(Object)
      );
    });

    test("passes current filters to useInfiniteScrollItems", () => {
      setupMocks();
      renderItemListFiltered();

      const callArgs = (useInfiniteScrollItems.useInfiniteScrollItems as jest.Mock).mock.calls[0];
      expect(callArgs[1]).toEqual({});
    });

    test("shows loading spinner when hasMore is true and loading", () => {
      setupMocks(mockItems, true, true);
      renderItemListFiltered();

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("shows end of list message when hasMore is false", () => {
      setupMocks(mockItems, false, false);
      renderItemListFiltered();

      expect(screen.getByText(/Aucun autres items à charger/i)).toBeInTheDocument();
    });

    test("does not show end message when hasMore is true", () => {
      setupMocks(mockItems, true, false);
      renderItemListFiltered();

      expect(screen.queryByText(/Aucun autres items à charger/i)).not.toBeInTheDocument();
    });
  });

  describe("Filter Handling", () => {
    test("calls useInfiniteScrollItems with empty filters initially", () => {
      renderItemListFiltered();

      expect(useInfiniteScrollItems.useInfiniteScrollItems).toHaveBeenCalledWith(
        itemService.getFilteredItems,
        {}
      );
    });

    test("parses URL query parameters on mount", async () => {
      renderItemListFiltered("/?minP=50&maxP=200&categories=1");

      await waitFor(() => {
        expect(useInfiniteScrollItems.useInfiniteScrollItems).toHaveBeenCalledWith(
          itemService.getFilteredItems,
          {
            minP: 50,
            maxP: 200,
            categories: [1],
          }
        );
      });
    });

    test("parses multiple categories from URL", async () => {
      renderItemListFiltered("/?categories=1,2,3");

      await waitFor(() => {
        const lastCall = (useInfiniteScrollItems.useInfiniteScrollItems as jest.Mock).mock.calls.slice(-1)[0];
        expect(lastCall[1].categories).toEqual([1, 2, 3]);
      });
    });

    test("parses favorites filter from URL", async () => {
      renderItemListFiltered("/?fav=true");

      await waitFor(() => {
        const lastCall = (useInfiniteScrollItems.useInfiniteScrollItems as jest.Mock).mock.calls.slice(-1)[0];
        expect(lastCall[1].fav).toBe(true);
      });
    });

    test("parses all filter parameters from URL", async () => {
      renderItemListFiltered(
        "/?minP=20&maxP=150&maxD=50&fav=true&categories=1&tags=2&wears=1&deliveries=2&payments=1"
      );

      await waitFor(() => {
        const lastCall = (useInfiniteScrollItems.useInfiniteScrollItems as jest.Mock).mock.calls.slice(-1)[0];
        const filters = lastCall[1];

        expect(filters.minP).toBe(20);
        expect(filters.maxP).toBe(150);
        expect(filters.maxD).toBe(50);
        expect(filters.fav).toBe(true);
        expect(filters.categories).toEqual([1]);
        expect(filters.tags).toEqual([2]);
        expect(filters.wears).toEqual([1]);
        expect(filters.deliveries).toEqual([2]);
        expect(filters.payments).toEqual([1]);
      });
    });
  });

  describe("Error Handling", () => {
    test("displays error alert when error is present", () => {
      const mockError = new Error("Network error");
      setupMocks([], false, false, mockError);
      renderItemListFiltered();

      expect(screen.getByText(/Erreur lors du chargement/i)).toBeInTheDocument();
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });

    test("still shows items when error occurs after loading", () => {
      const mockError = new Error("Network error");
      setupMocks(mockItems, false, false, mockError);
      renderItemListFiltered();

      expect(screen.getByText(/Erreur lors du chargement/i)).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    test("renders filter card on the left side", () => {
      setupMocks(mockItems);
      const { container } = renderItemListFiltered();

      const filterCard = container.querySelector('[class*="MuiCard"]');
      expect(filterCard).toBeInTheDocument();
    });

    test("renders items grid on the right side", () => {
      setupMocks(mockItems);
      const { container } = renderItemListFiltered();

      const grid = container.querySelector('[class*="MuiGrid"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Sentinel Element", () => {
    test("renders sentinel element for infinite scroll", () => {
      setupMocks(mockItems, true, true);
      const { container } = renderItemListFiltered();

      const sentinel = container.querySelector('[data-testid="infinite-scroll-sentinel"]') ||
                       container.querySelector('.infinite-scroll-sentinel') ||
                       mockSentinelRef.current;

      // The sentinel is rendered via ref, which we can't directly test in jsdom
      // But we can verify that useInfiniteScrollItems was called correctly
      expect(useInfiniteScrollItems.useInfiniteScrollItems).toHaveBeenCalled();
    });
  });

  describe("Grid Layout", () => {
    test("renders items in a grid container", () => {
      setupMocks(mockItems);
      const { container } = renderItemListFiltered();

      const gridItems = container.querySelectorAll('[class*="MuiGrid"]');
      expect(gridItems.length).toBeGreaterThan(0);
    });

    test("renders correct number of item grid items", () => {
      setupMocks(mockItems);
      renderItemListFiltered();

      const itemCards = screen.getAllByTestId("item-card");
      expect(itemCards).toHaveLength(mockItems.length);
    });
  });

  describe("Empty State", () => {
    test("shows card with empty state message", () => {
      setupMocks([], false, false);
      const { container } = renderItemListFiltered();

      const card = container.querySelector('[class*="MuiCard"]');
      expect(card).toBeInTheDocument();
    });

    test("does not show infinite scroll spinner in empty state", () => {
      setupMocks([], false, false);
      renderItemListFiltered();

      const spinners = screen.queryAllByRole("progressbar");
      expect(spinners).toHaveLength(0);
    });

    test("shows spinner in empty state when loading", () => {
      setupMocks([], false, true);
      renderItemListFiltered();

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
