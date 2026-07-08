import { render, screen } from "@testing-library/react";
import ReviewRow from "components/ReviewRow";
import { ReviewDetail } from "services/reviewService";

const mockReview: ReviewDetail = {
  firstName: "Alex",
  lastName: "Larouche",
  profilPictureGuid: "abc123",
  content: "Excellent vendeur, très rapide !",
  timestamp: "2026-05-24T09:39:59.000Z",
  rating: 5,
};

const renderReviewRow = (review: ReviewDetail = mockReview) => {
  return render(<ReviewRow review={review} />);
};

describe("ReviewRow Component", () => {

  describe("Rendering", () => {
    test("renders reviewer full name", () => {
      renderReviewRow();
      expect(screen.getByText("Alex Larouche")).toBeInTheDocument();
    });

    test("renders review content", () => {
      renderReviewRow();
      expect(screen.getByText("Excellent vendeur, très rapide !")).toBeInTheDocument();
    });

    test("renders formatted date", () => {
      renderReviewRow();
      expect(screen.getByText(/2026/)).toBeInTheDocument();
    });
  });

  describe("Avatar Initials", () => {
    test("shows correct initials from first and last name", () => {
      renderReviewRow();
      expect(screen.getByText("AL")).toBeInTheDocument();
    });

    test("different reviewer shows correct initials", () => {
      renderReviewRow({ ...mockReview, firstName: "Marie", lastName: "Tremblay" });
      expect(screen.getByText("MT")).toBeInTheDocument();
    });
  });

  describe("Rating", () => {
    test("renders rating component", () => {
      renderReviewRow();
      const rating = screen.getByLabelText("5 Stars");
      expect(rating).toBeInTheDocument();
    });

    test("renders correct rating value", () => {
      renderReviewRow({ ...mockReview, rating: 3 });
      const rating = screen.getByLabelText("3 Stars");
      expect(rating).toBeInTheDocument();
    });
  });

  describe("ProfileBox with reviewAverage", () => {
    test("renders different reviewer content correctly", () => {
      renderReviewRow({
        ...mockReview,
        firstName: "Jean",
        lastName: "Boucher",
        content: "Mauvais service",
        rating: 1,
      });
      expect(screen.getByText("Jean Boucher")).toBeInTheDocument();
      expect(screen.getByText("Mauvais service")).toBeInTheDocument();
      expect(screen.getByLabelText("1 Star")).toBeInTheDocument();
    });
  });
});