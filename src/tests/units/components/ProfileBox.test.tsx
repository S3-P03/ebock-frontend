import { render, screen } from "@testing-library/react";
import ProfileBox from "components/ProfileBox";
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
  return render(<ProfileBox seller={seller} reviewAverage={reviewAverage} itemsOnSale={12} />);
};

describe("ProfileBox Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
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

    test("renders sold items text", () => {
      renderBox();
      expect(screen.getByText(/Articles vendus/)).toBeInTheDocument();
    });

    test("renders sold items number", () => {
      renderBox();
      expect(screen.getByText(/14/)).toBeInTheDocument();
    });

    test("renders items on sale text", () => {
      renderBox();
      expect(screen.getByText(/Articles en vente/)).toBeInTheDocument();
    });

    test("renders items on sale number", () => {
      renderBox();
      expect(screen.getByText(/12/)).toBeInTheDocument();
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
});