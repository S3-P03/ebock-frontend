import { render, waitFor } from "@testing-library/react";
import { fetchUserStoreFront } from "services/userService";
import useAuthSession from "hooks/useAuthSession";
import SellerProfile from "pages/SellerProfile";
import { fetchReviewAverage, fetchReviewDetails } from "services/reviewService";
import { fetchUserItems } from "services/itemService";

const mockNavigate = jest.fn();

jest.mock("services/reviewService", () => ({
  fetchReviewAverage: jest.fn(),
  fetchReviewDetails: jest.fn(),
}));

jest.mock("services/userService", () => ({
  fetchUserStoreFront: jest.fn(),
}));

jest.mock("services/itemService", () => ({
  fetchUserItems: jest.fn(),
}));

jest.mock("hooks/useAuthSession", () => jest.fn());

jest.mock("components/ProfileBox", () => () => <div data-testid="profile-box" />);
jest.mock("components/items/ItemDisplayBox", () => () => <div data-testid="item-display-box" />);
jest.mock("components/ReviewRow", () => () => <div data-testid="review-row" />);
jest.mock("components/CenteredCircularProgress", () => () => <div data-testid="spinner" />);

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

describe("SellerProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthSession as jest.Mock).mockReturnValue({ isAuthenticated: false, token: null, logout: jest.fn() });
    (fetchUserItems as jest.Mock).mockResolvedValue([]);
    (fetchUserStoreFront as jest.Mock).mockResolvedValue(null);
    (fetchReviewAverage as jest.Mock).mockResolvedValue(null);
    (fetchReviewDetails as jest.Mock).mockResolvedValue(null);
  });

  test("navigates to /404 when the seller is not found", async () => {
    render(<SellerProfile />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/404");
    });
  });

  test("renders spinner while loading", () => {
    const { getByTestId } = render(<SellerProfile />);
    expect(getByTestId("spinner")).toBeInTheDocument();
  });
});
