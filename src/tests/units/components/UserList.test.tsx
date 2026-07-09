import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserList from "components/admin/UserList";
import { Users } from "interfaces/Admin";

const mockUsers: Users[] = [
  {
    cip: "u1",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice.smith@example.com",
    enabled: true,
  },
  {
    cip: "u2",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    enabled: false,
  },
];

describe("UserList", () => {
  it("affiche une ligne par utilisateur quand users est un tableau", () => {
    render(<UserList users={mockUsers} onToggleRequest={jest.fn()} />);

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("affiche une liste vide sans erreur", () => {
    render(<UserList users={[]} onToggleRequest={jest.fn()} />);
    expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
  });

  it("appelle onToggleRequest avec le bon utilisateur au clic", async () => {
    const onToggleRequest = jest.fn();
    render(<UserList users={[mockUsers[0]]} onToggleRequest={onToggleRequest} />);

    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);

    expect(onToggleRequest).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("utilise cip comme clé unique", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<UserList users={mockUsers} onToggleRequest={jest.fn()} />);

    const keyWarnings = consoleSpy.mock.calls.filter((call) =>
      String(call[0]).includes("key")
    );
    expect(keyWarnings).toHaveLength(0);
    consoleSpy.mockRestore();
  });
});