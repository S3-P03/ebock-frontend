import { render, waitFor } from "@testing-library/react";
import { fetchUser } from "services/userService";
import { fetchRoom, fetchMessages } from "services/messageService";
import useAuthSession from "hooks/useAuthSession";
import MessageRoom from "pages/MessageRoom";
import useWebSocket from "hooks/useWebSocket";

const mockNavigate = jest.fn();

jest.mock("services/messageService", () => ({
  fetchRoom: jest.fn(),
  fetchMessages: jest.fn(),
}));

jest.mock("services/userService", () => ({
  fetchUser: jest.fn(),
}));

jest.mock("hooks/useWebSocket", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("hooks/useAuthSession", () => jest.fn());

jest.mock("components/RoomHeader", () => () => <div data-testid="room-header" />);
jest.mock("components/MessageBlock", () => () => <div data-testid="message-block" />);
jest.mock("components/CenteredCircularProgress", () => () => <div data-testid="spinner" />);

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

describe("MessageRoom", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthSession as jest.Mock).mockReturnValue({ isAuthenticated: false, token: null, logout: jest.fn() });
    (useWebSocket as jest.Mock).mockImplementation(() => {});
    (fetchRoom as jest.Mock).mockResolvedValue(null);
    (fetchMessages as jest.Mock).mockResolvedValue([]);
    (fetchUser as jest.Mock).mockResolvedValue(null);
  });

  test("navigates to /404 when the room is not found", async () => {
    render(<MessageRoom />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/404");
    });
  });

  test("renders spinner while loading", () => {
    const { getByTestId } = render(<MessageRoom />);
    expect(getByTestId("spinner")).toBeInTheDocument();
  });
});
