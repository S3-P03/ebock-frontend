import { fireEvent, render, screen } from "@testing-library/react";
import ProfilePicChanger from "components/ProfilePicChanger";

type RenderProfilePicChangerProps = {
  currentProfilePictureUrl?: string | null;
  initials?: string;
  onSave?: jest.Mock;
};

beforeAll(() => {
  Object.defineProperty(global.URL, "createObjectURL", {
    writable: true,
    configurable: true,
    value: jest.fn(() => "blob:test-url"),
  });
  Object.defineProperty(global.URL, "revokeObjectURL", {
    writable: true,
    configurable: true,
    value: jest.fn(),
  });
});

const renderProfilePicChanger = ({
  currentProfilePictureUrl = null,
  initials = "JD",
  onSave = jest.fn(),
}: RenderProfilePicChangerProps = {}) =>
  render(
    <ProfilePicChanger
      currentProfilePictureUrl={currentProfilePictureUrl}
      initials={initials}
      onSave={onSave}
    />
  );

describe("ProfilePicChanger component", () => {
  test("renders initials when no profile picture is present", () => {
    const onSave = jest.fn();
    renderProfilePicChanger({ onSave });

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.queryByText(/Supprimer la photo de profil/i)).toBeNull();
    expect(screen.getByRole("button", { name: /Enregistrer/i })).toBeDisabled();
  });

  test("renders current profile picture and remove button when URL exists", () => {
    const onSave = jest.fn();
    renderProfilePicChanger({
      currentProfilePictureUrl: "http://example.com/avatar.jpg",
      initials: "JD",
      onSave,
    });

    expect(screen.getByRole("img", { name: /photo de profil/i })).toHaveAttribute(
      "src",
      "http://example.com/avatar.jpg"
    );
    expect(screen.getByRole("button", { name: /Supprimer la photo de profil/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enregistrer/i })).toBeDisabled();
  });

  test("enables save after choosing a new image and passes the file to onSave", () => {
    const onSave = jest.fn();
    const { container } = renderProfilePicChanger({
      currentProfilePictureUrl: null,
      initials: "JD",
      onSave,
    });

    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByRole("button", { name: /Enregistrer/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /Enregistrer/i }));
    expect(onSave).toHaveBeenCalledWith(file, false);
  });

  test("enables save after removing the current profile picture and passes remove flag", () => {
    const onSave = jest.fn();
    renderProfilePicChanger({
      currentProfilePictureUrl: "http://example.com/avatar.jpg",
      initials: "JD",
      onSave,
    });

    fireEvent.click(screen.getByRole("button", { name: /Supprimer la photo de profil/i }));
    expect(screen.getByRole("button", { name: /Enregistrer/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /Enregistrer/i }));
    expect(onSave).toHaveBeenCalledWith(null, true);
  });
});
