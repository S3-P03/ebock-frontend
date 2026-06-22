import { render, screen } from "@testing-library/react";
import MessageBlock from "components/MessageBlock";
import { Message } from "interfaces/Message";
 
const mockMessages: Message[] = [
  {
    roomId: 1,
    content: "Bonjour",
    senderCip: "boum7113",
    senderFirstName: "Milo",
    senderLastName: "Boucher",
    sentAt: new Date("2026-06-22T11:00:00"),
  },
  {
    roomId: 2,
    content: "Salut",
    senderCip: "larj4236",
    senderFirstName: "Jean-Félix",
    senderLastName: "Larouche",
    sentAt: new Date("2026-06-22T12:00:00"),
  },
  {
    roomId: 1,
    content: "Comment allez-vous",
    senderCip: "boum7113",
    senderFirstName: "Milo",
    senderLastName: "Boucher",
    sentAt: new Date("2026-06-22T13:00:00"),
  },
];
 
const renderBlock = (messages: Message[] = mockMessages) => {
  return render(<MessageBlock messages={messages} cip={"boum7113"} />);
};
 
describe("MessageBlock Component", () => {
  // Test Group 1: Rendering
  describe("Rendering", () => {
 
    test("renders first message", () => {
      renderBlock();
      expect(screen.getByText("Bonjour")).toBeInTheDocument();
    });

    test("renders second message", () => {
      renderBlock();
      expect(screen.getByText("Salut")).toBeInTheDocument();
    });

    test("renders third message", () => {
      renderBlock();
      expect(screen.getByText("Comment allez-vous")).toBeInTheDocument();
    });
  });
 
  // Test Group 2: Sender
  describe("Sender information", () => {
    test("displays sender name", () => {
      renderBlock();
      expect(screen.getByText(/Jean-Félix L/)).toBeInTheDocument();
    });

    test("displays sentAt time", () => {
      renderBlock();
      expect(screen.getByText(/12:00/)).toBeInTheDocument();
    });
  });
});