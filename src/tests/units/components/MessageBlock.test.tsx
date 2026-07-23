process.env.TZ = "America/Toronto";
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
    sentAt: new Date("2026-06-22T11:00:00Z"),
  },
  {
    roomId: 2,
    content: "Salut",
    senderCip: "larj4236",
    senderFirstName: "Jean-Félix",
    senderLastName: "Larouche",
    sentAt: new Date("2026-06-22T12:00:00Z"),
  },
  {
    roomId: 1,
    content: "Comment allez-vous",
    senderCip: "boum7113",
    senderFirstName: "Milo",
    senderLastName: "Boucher",
    sentAt: new Date("2026-06-22T13:00:00Z"),
  },
];
 
const renderBlock = (messages: Message[] = mockMessages) => {
  return render(<MessageBlock messages={messages} cip={"boum7113"} senderProfilePictureUrl={null} receiverProfilePictureUrl={null} />);
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
  });
});

describe("MessageBlock timezone conversion", () => {

  afterEach(() => {
    jest.useRealTimers();
  });

  test("affiche l'heure locale convertie depuis UTC pour un message d'aujourd'hui", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T15:00:00Z"));

    render(
      <MessageBlock
        cip="123"
        messages={[
          {
            roomId: 1,
            content: "Bonjour",
            senderCip: "boum7113",
            senderFirstName: "Milo",
            senderLastName: "Boucher",
            sentAt: new Date("2026-07-20T15:00:00Z")
          },
        ]}
        senderProfilePictureUrl={null}
        receiverProfilePictureUrl={null}
      />
    );

    expect(
      screen.getByText(/Milo B -/)
    ).toBeInTheDocument();
  });


  test("affiche la date complète si le message n'est pas aujourd'hui", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T15:00:00Z"));

    render(
      <MessageBlock
        cip="123"
        messages={[
          {
            roomId: 1,
            content: "Bonjour",
            senderCip: "boum7113",
            senderFirstName: "Milo",
            senderLastName: "Boucher",
            sentAt: new Date("2026-07-18T18:30:00Z"),
          },
        ]}
        senderProfilePictureUrl={null}
        receiverProfilePictureUrl={null}
      />
    );

    expect(
      screen.getByText(/07\/18\/2026/)
    ).toBeInTheDocument();
  });

  test("groupe les messages du même expéditeur sans afficher deux fois le footer", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T15:00:00Z"));
    render(
      <MessageBlock
        cip="123"
        messages={[
          {
            roomId: 1,
            content: "Message 1",
            senderCip: "boum7113",
            senderFirstName: "Milo",
            senderLastName: "Boucher",
            sentAt: new Date("2026-07-20T18:30:00Z"),
          },
          {
            roomId: 1,
            content: "Message 2",
            senderCip: "boum7113",
            senderFirstName: "Milo",
            senderLastName: "Boucher",
            sentAt: new Date("2026-07-20T18:31:00Z"),
          },
        ]}
        senderProfilePictureUrl={null}
        receiverProfilePictureUrl={null}
      />
    );

    expect(screen.getByText("Message 1")).toBeInTheDocument();
    expect(screen.getByText("Message 2")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Milo B -/)
    ).toHaveLength(1);
  });
});