import { render, screen } from "@testing-library/react";
import { Message } from "interfaces/Message";
import SingleMessage from "components/Message";

const sentMessage: Message = {
  roomId: 1,
  content: "Bonjour",
  senderCip: "boum7113",
  senderFirstName: "Milo",
  senderLastName: "Boucher",
  sentAt: new Date("2026-06-22T12:00:00Z"),
};

const renderMessage = (message: Message = sentMessage, isSent = true) => {
  return render(<SingleMessage message={message} isSent={isSent} profilePictureUrl={null} />);
};

describe("Message Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
    test("renders message content", () => {
      renderMessage();
      expect(
        screen.getByText("Bonjour")
      ).toBeInTheDocument();
    });
  });

  // Test Group 2: Avatar Initials
  describe("Avatar Initials", () => {
    test("renders uppercased initials in avatar", () => {
      renderMessage();
      expect(screen.getByText("MB")).toBeInTheDocument();
    });
  });
});