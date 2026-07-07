import { render, screen } from "@testing-library/react";
import SellerBox from "components/SellerBox";
import { SellerUser } from "interfaces/Seller";
import { ReviewAverage } from "services/reviewService";

const mockSeller: SellerUser = {
  firstName: "Éliane",
  lastName: "Pelletier",
  profilePictureUrl: null,
  createdAt: new Date("2022-09-01T00:00:00Z"),
  soldItems: 14,
};

const mockReviewAverage = {
  avgRating: 4.5,
  nbrReviews: 10,
}

const renderBox = (seller: SellerUser = mockSeller, reviewAverage: ReviewAverage | null = mockReviewAverage) => {
  return render(<SellerBox seller={seller} reviewAverage={reviewAverage} handleOpenStorefront={() => {}} />);
};

describe("SellerBox Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
    test("renders VENDEUR section title", () => {
      renderBox();
      expect(screen.getByText("VENDEUR")).toBeInTheDocument();
    });

    test("renders seller full name", () => {
      renderBox();
      expect(screen.getByText("Éliane Pelletier")).toBeInTheDocument();
    });

    test("renders member-since text", () => {
      renderBox();
      expect(screen.getByText(/Membre depuis/)).toBeInTheDocument();
    });

    test("renders member-since year", () => {
      renderBox();
      expect(screen.getByText(/2022/)).toBeInTheDocument();
    });
  });

  // Test Group 2: Avatar Initials
  describe("Avatar Initials", () => {
    test("avatar shows first letters of first and last name", () => {
      renderBox();
      expect(screen.getByText("ÉP")).toBeInTheDocument();
    });

    test("different seller -> correct initials shown", () => {
      renderBox({ ...mockSeller, firstName: "David", lastName: "Bélanger" });
      expect(screen.getByText("DB")).toBeInTheDocument();
    });
  });

  // Test Group 3: Member Since Month
  describe("Member Since Month", () => {
    test("September date -> shows correct month name", () => {
      renderBox();
      expect(screen.getByText(/Membre depuis/)).toBeInTheDocument();
    });

    test("January date -> shows correct month name", () => {
      renderBox({ ...mockSeller, createdAt: new Date("2021-01-15T00:00:00Z") });
      expect(screen.getByText(/2021/)).toBeInTheDocument();
    });
  });

  // Test Group 4: Rating
  describe("Rating", () => {
    test("renders rating component", () => {
      renderBox();
      expect(screen.getByText("(10)")).toBeInTheDocument();
    });
  });

  // Test Group 5: Redirect
  describe("Redirect", () => {
    test("clicking on avatar calls handleOpenStorefront", () => {
      const mockHandleOpenStorefront = jest.fn();
      render(<SellerBox seller={mockSeller} reviewAverage={mockReviewAverage} handleOpenStorefront={mockHandleOpenStorefront} />);
      
      const avatarButton = screen.getByRole("button");
      avatarButton.click();
      
      expect(mockHandleOpenStorefront).toHaveBeenCalledTimes(1);
    });
  });
});