process.env.TZ = "America/Toronto";
import { render, screen } from "@testing-library/react";
import Comment from "components/Comment";
import { CommentDetail } from "interfaces/Comment";

const mockComment: CommentDetail = {
    idComment: 1,
    content: "Est-ce que le livre est toujours disponible?",
    firstName: "Milo",
    lastName: "Boucher",
    timestamp: "2026-07-20T18:30:00Z",
    idParentComment: null,
    profilePictureUrl: null
};

const renderComment = (comment: CommentDetail = mockComment, isReply = false) => {
  return render(<Comment comment={comment} isReply={isReply} />);
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

describe("Comment timezone conversion", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("convertit UTC vers heure locale Québec", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T15:00:00Z"));

    render(
      <Comment
        isReply={false}
        profilePictureUrl={null}
        comment={{
          idComment: 1,
          content: "Est-ce que le livre est toujours disponible?",
          firstName: "Milo",
          lastName: "Boucher",
          timestamp: "2026-07-20T18:30:00Z",
          idParentComment: null,
        }}
      />
    );

    expect(
      screen.getByText(/Aujourd'hui à 14 h 30/)
    ).toBeInTheDocument();
  });
});