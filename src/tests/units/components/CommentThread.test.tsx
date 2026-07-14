import { render, screen, fireEvent } from "@testing-library/react";
import CommentThread from "components/CommentThread";
import { ItemComment } from "interfaces/Item";
 
const mockComments: ItemComment[] = [
    {
        idComment: 1,
        content: "Le manuel est-il en bon état?",
        firstName: "Jean-Félix",
        lastName: "Larouche",
        timestamp: "2026-07-09 13:17:37.959103",
        idParentComment: null,
    },
    {
        idComment: 2,
        content: "Oui, quelques annotations seulement.",
        firstName: "Éliane",
        lastName: "Pelletier",
        timestamp: "2026-07-09 13:17:37.959103",
        idParentComment: 1,
    },
    {
        idComment: 3,
        content: "Est-ce que la livraison est possible?",
        firstName: "Jean-Félix",
        lastName: "Larouche",
        timestamp: "2026-07-09 13:17:37.959103",
        idParentComment: null,
    },
];

const mockOnCommentSubmitted = jest.fn().mockResolvedValue(200);

const renderThread = (comments: ItemComment[] = mockComments, isSeller = true) => {
    return render(<CommentThread comments={comments} onCommentSubmitted={mockOnCommentSubmitted} isSeller={isSeller} />);
};
 
describe("CommentThread Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
    test("renders QUESTIONS & RÉPONSES title", () => {
      renderThread();
      expect(screen.getByText("QUESTIONS & RÉPONSES")).toBeInTheDocument();
    });
 
    test("renders top-level comment", () => {
      renderThread();
      expect(screen.getByText("Le manuel est-il en bon état?")).toBeInTheDocument();
    });
 
    test("renders second top-level comment", () => {
      renderThread();
      expect(screen.getByText("Est-ce que la livraison est possible?")).toBeInTheDocument();
    });
 
    test("empty comments list -> renders title without errors", () => {
      renderThread([]);
      expect(screen.getByText("QUESTIONS & RÉPONSES")).toBeInTheDocument();
    });
  });
 
  // Test Group 2: Replies
  describe("Replies", () => {
    test("reply contains user info as prefix", () => {
      renderThread();
      expect(screen.getByText(/@Jean-Félix L/)).toBeInTheDocument();
    });
 
    test("reply expected content", () => {
      renderThread();
      expect(
        screen.getByText(/Oui, quelques annotations seulement\./)
      ).toBeInTheDocument();
    });
 
    test("top-level comments only -> no reply prefix shown", () => {
      const noReplies = mockComments.filter((c) => c.idParentComment === null);
      renderThread(noReplies);
      expect(screen.queryByText(/@/)).not.toBeInTheDocument();
    });
  });
 
  // Test Group 3: Input Area
  describe("Input Area", () => {
    test("renders comment input field", () => {
      renderThread();
      expect(
        screen.getByPlaceholderText("Ajouter un commentaire...")
      ).toBeInTheDocument();
    });
 
    test("renders Envoyer button", () => {
      renderThread();
      expect(screen.getByText("Envoyer")).toBeInTheDocument();
    });
 
    test("user can type in the comment field", () => {
      renderThread();
      const input = screen.getByPlaceholderText("Ajouter un commentaire...");
      fireEvent.change(input, { target: { value: "Super annonce!" } });
      expect((input as HTMLInputElement).value).toBe("Super annonce!");
    });
  });
 
  // Test Group 4: Thread Structure
  describe("Thread Structure", () => {
    test("renders correct number of top-level comments", () => {
      renderThread();
      const rootContents = [
        "Le manuel est-il en bon état?",
        "Est-ce que la livraison est possible?",
      ];
      rootContents.forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });
 
    test("reply comment is not rendered as a top-level comment", () => {
      renderThread();
      expect(
        screen.queryByText("Oui, quelques annotations seulement.")
      ).not.toBeInTheDocument();
    });
  });
});