import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddReviewForm from "components/AddReviewForm";
import * as reviewService from "services/reviewService";

jest.mock("services/reviewService");
jest.mock("hooks/useAuthSession", () => ({
  __esModule: true,
  default: () => ({ token: "mock-token" }),
}));

const mockedPostReview = reviewService.postReview as jest.MockedFunction<typeof reviewService.postReview>;

const mockOnReviewSubmitted = jest.fn();

const renderForm = () => {
  return render(
    <AddReviewForm cip="pele3157" onReviewSubmitted={mockOnReviewSubmitted} />
  );
};

describe("AddReviewForm Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders title", () => {
      renderForm();
      expect(screen.getByText("Laisser un avis")).toBeInTheDocument();
    });

    test("renders comment field", () => {
      renderForm();
      expect(screen.getByLabelText("Commentaire")).toBeInTheDocument();
    });

    test("renders submit button", () => {
      renderForm();
      expect(screen.getByText("Soumettre")).toBeInTheDocument();
    });

    test("renders rating component", () => {
      renderForm();
      expect(screen.getByText("Note")).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    test("shows error when submitting without rating", async () => {
      renderForm();
      fireEvent.click(screen.getByText("Soumettre"));
      expect(await screen.findByText("Veuillez sélectionner une note.")).toBeInTheDocument();
    });

    test("shows error when submitting without comment", async () => {
      renderForm();
      fireEvent.click(screen.getByRole("radio", { name: "5 Stars" }));
      fireEvent.click(screen.getByText("Soumettre"));
      expect(await screen.findByText("Veuillez écrire un commentaire.")).toBeInTheDocument();
    });
  });

  describe("Submission", () => {
    test("calls postReview with correct arguments on success", async () => {
      mockedPostReview.mockResolvedValue(200);
      renderForm();

      const stars = screen.getAllByRole("radio");
      fireEvent.click(stars[4]);
      fireEvent.change(screen.getByLabelText("Commentaire"), {
        target: { value: "Super vendeur !" },
      });
      fireEvent.click(screen.getByText("Soumettre"));

      await waitFor(() => {
        expect(mockedPostReview).toHaveBeenCalledWith("pele3157", "Super vendeur !", 5, "mock-token");
      });
    });

    test("calls onReviewSubmitted after successful submission", async () => {
      mockedPostReview.mockResolvedValue(200);
      renderForm();

      fireEvent.click(screen.getByRole("radio", { name: "5 Stars" }));
      fireEvent.change(screen.getByLabelText("Commentaire"), {
        target: { value: "Super vendeur !" },
      });
      fireEvent.click(screen.getByText("Soumettre"));

      await waitFor(() => {
        expect(mockOnReviewSubmitted).toHaveBeenCalledTimes(1);
      });
    });

    test("shows error message when submission fails", async () => {
      mockedPostReview.mockResolvedValue(500);
      renderForm();

      fireEvent.click(screen.getByRole("radio", { name: "5 Stars" }));
      fireEvent.change(screen.getByLabelText("Commentaire"), {
        target: { value: "Super vendeur !" },
      });
      fireEvent.click(screen.getByText("Soumettre"));

      expect(await screen.findByText("Une erreur est survenue. Veuillez réessayer.")).toBeInTheDocument();
    });

    test("does not call onReviewSubmitted when submission fails", async () => {
      mockedPostReview.mockResolvedValue(500);
      renderForm();

      fireEvent.click(screen.getByRole("radio", { name: "5 Stars" }));
      fireEvent.change(screen.getByLabelText("Commentaire"), {
        target: { value: "Super vendeur !" },
      });
      fireEvent.click(screen.getByText("Soumettre"));

      await waitFor(() => {
        expect(mockOnReviewSubmitted).not.toHaveBeenCalled();
      });
    }); 

    test("shows 403 error message when user has no conversation", async () => {
      mockedPostReview.mockResolvedValue(403);
      renderForm();

      fireEvent.click(screen.getByRole("radio", { name: "5 Stars" }));
      fireEvent.change(screen.getByLabelText("Commentaire"), {
        target: { value: "Super vendeur !" },
      });
      fireEvent.click(screen.getByText("Soumettre"));

      expect(await screen.findByText("Vous devez avoir eu une conversation avec ce vendeur pour laisser un avis.")).toBeInTheDocument();
    });
  });
});