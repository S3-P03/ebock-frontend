import { render, waitFor, fireEvent } from "@testing-library/react";
import ItemDetails from "pages/ItemDetails";
import { fetchItem, fetchItemImages, updateItem } from "services/itemService";
import { fetchUser, fetchUserStoreFront } from "services/userService";
import { fetchImage } from "services/imageService";
import { fetchReviewAverage } from "services/reviewService";
import useAuthSession from "hooks/useAuthSession";

const mockNavigate = jest.fn();

jest.mock("services/itemService", () => ({
  fetchItem: jest.fn(),
  fetchItemImages: jest.fn(),
  updateItem: jest.fn(),
}));

jest.mock("services/userService", () => ({
  fetchUser: jest.fn(),
  fetchUserStoreFront: jest.fn(),
}));

jest.mock("services/imageService", () => ({
  fetchImage: jest.fn(),
}));

jest.mock("services/reviewService", () => ({
  fetchReviewAverage: jest.fn(),
}));

jest.mock("hooks/useAuthSession", () => jest.fn());

jest.mock("components/CommentThread", () => () => <div data-testid="comment-thread" />);
jest.mock("components/ImageList", () => () => <div data-testid="image-list" />);
jest.mock("components/SellerBox", () => () => <div data-testid="seller-box" />);
jest.mock("components/items/ItemAdditionalInfoBox", () => () => <div data-testid="additional-info" />);
jest.mock("components/items/ItemMainInfoBox", () => () => <div data-testid="main-info" />);
jest.mock("components/items/ItemSellerOptionBox", () => ({ item, changeItemQuantity }: any) => (
  <button data-testid="seller-option-box" onClick={() => changeItemQuantity(1)}>
    SellerOptionBox
  </button>
));
jest.mock("components/CenteredCircularProgress", () => () => <div data-testid="spinner" />);

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

describe("ItemDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthSession as jest.Mock).mockReturnValue({ isAuthenticated: false, token: null, logout: jest.fn() });
    (fetchItem as jest.Mock).mockResolvedValue(null);
    (fetchItemImages as jest.Mock).mockResolvedValue([]);
    (fetchUser as jest.Mock).mockResolvedValue(null);
    (fetchUserStoreFront as jest.Mock).mockResolvedValue(null);
    (fetchImage as jest.Mock).mockResolvedValue(null);
    (fetchReviewAverage as jest.Mock).mockResolvedValue(null);
  });

  test("navigates to /404 when the item is not found", async () => {
    render(<ItemDetails />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/404");
    });
  });

  test("renders spinner while loading", () => {
    const { getByTestId } = render(<ItemDetails />);
    expect(getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders seller option box and calls updateItem when the current user is the seller", async () => {
    const item = {
      itemId: 1,
      name: "Test Item",
      description: "Test description",
      price: 10,
      addedAt: new Date().toISOString(),
      quantity: 3,
      category: "Test category",
      wear: "Used",
      sellerCip: "test1234",
      paymentOptions: ["Cash"],
      deliveryOptions: ["Pickup"],
      tags: [1],
    };

    (useAuthSession as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      token: "fake-token",
      logout: jest.fn(),
      connectedUser: { cip: "test1234" },
    });
    (fetchUser as jest.Mock).mockResolvedValue({ cip: "test1234" });
    (fetchItem as jest.Mock).mockResolvedValue(item);
    (fetchItemImages as jest.Mock).mockResolvedValue([]);
    (fetchUserStoreFront as jest.Mock).mockResolvedValue({});

    const { getByTestId } = render(<ItemDetails />);

    await waitFor(() => {
      expect(getByTestId("seller-option-box")).toBeInTheDocument();
    });

    fireEvent.click(getByTestId("seller-option-box"));

    expect(updateItem).toHaveBeenCalledWith(item.itemId, "fake-token", { quantity: item.quantity - 1 });
  });
});
