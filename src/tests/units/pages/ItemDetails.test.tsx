import { render, waitFor } from "@testing-library/react";
import ItemDetails from "pages/ItemDetails";
import { fetchItem, fetchItemImages } from "services/itemService";
import { fetchUser, fetchUserStoreFront } from "services/userService";
import { fetchImage } from "services/imageService";
import { fetchReviewAverage } from "services/reviewService";
import useAuthSession from "hooks/useAuthSession";

const mockNavigate = jest.fn();

jest.mock("services/itemService", () => ({
  fetchItem: jest.fn(),
  fetchItemImages: jest.fn(),
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
});
