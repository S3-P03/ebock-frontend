import { render, screen } from "@testing-library/react";
import Comment from "components/Comment";
import { ItemComment } from "interfaces/Item";

const mockComment: ItemComment = {
    idComment: 1,
    content: "Est-ce que le livre est toujours disponible?",
    firstName: "Milo",
    lastName: "Boucher",
    timestamp: "2026-07-09T13:17:37.959103",
    idParentComment: null,
};

const renderComment = (comment: ItemComment = mockComment, isReply = false, profilePictureUrl: string | null = null) => {
  return render(<Comment comment={comment} isReply={isReply} profilePictureUrl={profilePictureUrl} />);
};

describe("Comment Component", () => {
  describe("Rendering", () => {
    test("renders comment content", () => {
      renderComment();
      expect(
        screen.getByText("Est-ce que le livre est toujours disponible?")
      ).toBeInTheDocument();
    });

    test("renders author name and initial", () => {
      renderComment();
      expect(screen.getByText(/Milo B/)).toBeInTheDocument();
    });

    test("renders formatted date", () => {
      renderComment();
      expect(screen.getByText(/2026/)).toBeInTheDocument();
    });
  });

  describe("Avatar Initials", () => {
    test("renders uppercased initials in avatar", () => {
      renderComment();
      expect(screen.getByText("MB")).toBeInTheDocument();
    });
  });

  describe("Reply styling", () => {
    test("renders as normal comment when isReply is false", () => {
      renderComment(mockComment, false);
      expect(screen.getByText("Est-ce que le livre est toujours disponible?")).toBeInTheDocument();
    });

    test("renders as reply when isReply is true", () => {
      renderComment(mockComment, true);
      expect(screen.getByText("Est-ce que le livre est toujours disponible?")).toBeInTheDocument();
    });
  });
});