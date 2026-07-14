import { render, screen } from "@testing-library/react";
import Comment from "components/Comment";
import { ItemComment } from "interfaces/Item";

const mockComment: ItemComment = {
    idComment: 1,
    content: "Est-ce que le livre est toujours disponible?",
    firstName: "Milo",
    lastName: "Boucher",
    timestamp: "2026-07-09 13:17:37.959103",
    idParentComment: null,
};

const renderComment = (comment: ItemComment = mockComment, isReply = false) => {
  return render(<Comment comment={comment} isReply={isReply} />);
};

describe("Comment Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
    test("renders comment content", () => {
      renderComment();
      expect(
        screen.getByText("Est-ce que le livre est toujours disponible?")
      ).toBeInTheDocument();
    });

    test("renders author name and initial", () => {
      renderComment();
      // Format: "Milo B - il y a 2 jours"
      expect(screen.getByText(/Milo B/)).toBeInTheDocument();
    });

    test("renders timeAgo string", () => {
      renderComment();
      expect(screen.getByText(/il y a 2 jours/)).toBeInTheDocument();
    });
  });

  // Test Group 2: Avatar Initials
  describe("Avatar Initials", () => {
    test("renders uppercased initials in avatar", () => {
      renderComment();
      expect(screen.getByText("MB")).toBeInTheDocument();
    });
  });
});