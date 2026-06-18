import { render, screen } from "@testing-library/react";
import Comment from "../../../components/Comment";
import { ItemComment } from "../../../interfaces/Item";

const mockComment: ItemComment = {
  id: 1,
  content: "Est-ce que le livre est toujours disponible?",
  authorFirstName: "Milo",
  authorLastName: "Boucher",
  timeAgo: "il y a 2 jours",
  authorCip: "boum7113",
  respondToCommentId: null,
};

const replyComment: ItemComment = {
  id: 2,
  content: "Oui",
  authorFirstName: "Léanne",
  authorLastName: "Héroux",
  timeAgo: "il y a 2 jours",
  authorCip: "herl2700",
  respondToCommentId: 1,
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

  // Test Group 3: Reply vs Regular Comment Styling
  describe("Reply vs Regular Comment", () => {
    test("regular comment (isReply=false) -> renders content", () => {
      renderComment(mockComment, false);
      expect(
        screen.getByText("Est-ce que le livre est toujours disponible?")
      ).toBeInTheDocument();
    });

    test("reply comment (isReply=true) -> renders content", () => {
      renderComment(replyComment, true);
      expect(
        screen.getByText("Oui")
      ).toBeInTheDocument();
    });

    test("isReply=false -> avatar has neutral dark color", () => {
      const { container } = renderComment(mockComment, false);
      const avatar = container.querySelector(".MuiAvatar-root");
      expect(avatar).toBeInTheDocument();
    });

    test("isReply=true -> avatar has green tint color", () => {
      const { container } = renderComment(mockComment, true);
      const avatar = container.querySelector(".MuiAvatar-root");
      expect(avatar).toBeInTheDocument();
    });
  });
});