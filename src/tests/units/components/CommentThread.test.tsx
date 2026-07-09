import { render, screen, fireEvent } from "@testing-library/react";
import CommentThread from "components/CommentThread";
import { ItemComment } from "interfaces/Item";
 
const mockComments: ItemComment[] = [
  {
    id: 1,
    content: "Le manuel est-il en bon état?",
    authorFirstName: "Jean-Félix",
    authorLastName: "Larouche",
    timeAgo: "il y a 3 jours",
    authorCip: "larj4236",
    respondToCommentId: null,
  },
  {
    id: 2,
    content: "Oui, quelques annotations seulement.",
    authorFirstName: "Éliane",
    authorLastName: "Pelletier",
    timeAgo: "il y a 2 jours",
    authorCip: "pele3157",
    respondToCommentId: 1,
  },
  {
    id: 3,
    content: "Est-ce que la livraison est possible?",
    authorFirstName: "Jean-Félix",
    authorLastName: "Larouche",
    timeAgo: "il y a 1 jour",
    authorCip: "larj4236",
    respondToCommentId: null,
  },
];
 
const renderThread = (comments: ItemComment[] = mockComments, isAuthenticated: boolean = true) => {
  return render(<CommentThread comments={comments} isAuthenticated={isAuthenticated}/>);
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
      const noReplies = mockComments.filter((c) => c.respondToCommentId === null);
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