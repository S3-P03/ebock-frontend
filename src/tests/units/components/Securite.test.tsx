import { render, screen, fireEvent, act } from "@testing-library/react";
import Securite from "components/Securite";

const mockOnSave = jest.fn();

const renderComponent = () => {
  return render(<Securite user={null} onSave={mockOnSave} />);
};

describe("Securite Component", () => {
  beforeEach(() => {
    mockOnSave.mockClear();
  });

  describe("Rendering", () => {
    test("renders le titre", () => {
      renderComponent();
      expect(screen.getByText("Sécurité")).toBeInTheDocument();
    });

    test("renders les champs mot de passe vides", () => {
      renderComponent();
      const inputs = screen.getAllByDisplayValue("");
      expect(inputs.length).toBe(2);
    });

    test("renders le bouton Changer le mot de passe", () => {
      renderComponent();
      expect(screen.getByText("Changer le mot de passe")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    test("peut écrire dans le champ mot de passe actuel", () => {
      renderComponent();
      const input = screen.getByLabelText("Mot de passe actuel");
      fireEvent.change(input, { target: { value: "monMotDePasse" } });
      expect(screen.getByDisplayValue("monMotDePasse")).toBeInTheDocument();
    });

    test("peut écrire dans le champ nouveau mot de passe", () => {
      renderComponent();
      const input = screen.getByLabelText("Nouveau mot de passe");
      fireEvent.change(input, { target: { value: "nouveauMotDePasse" } });
      expect(screen.getByDisplayValue("nouveauMotDePasse")).toBeInTheDocument();
    });

    test("appelle onSave avec les bons mots de passe", async () => {
      mockOnSave.mockResolvedValue(undefined);
      renderComponent();
    
      await act(async () => {
        fireEvent.change(screen.getByLabelText("Mot de passe actuel"), { target: { value: "ancien" } });
        fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), { target: { value: "nouveau" } });
        fireEvent.click(screen.getByText("Changer le mot de passe"));
      });

      expect(mockOnSave).toHaveBeenCalledWith("ancien", "nouveau");
    });

    test("clear les champs après la soumission", async () => {
      mockOnSave.mockResolvedValue(undefined);
      renderComponent();

      await act(async () => {
        fireEvent.change(screen.getByLabelText("Mot de passe actuel"), { target: { value: "ancien" } });
        fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), { target: { value: "nouveau" } });
        fireEvent.click(screen.getByText("Changer le mot de passe"));
      });

      expect(screen.queryByDisplayValue("ancien")).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("nouveau")).not.toBeInTheDocument();
    });
  });
});