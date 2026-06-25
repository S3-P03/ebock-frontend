import { render, screen, fireEvent } from "@testing-library/react";
import InformationsPersonnelles from "components/UserInfo";
import { UserInformation } from "interfaces/User";

const mockUser: UserInformation = {
  user: {
    cip: "boum7113",
    firstName: "Jean",
    lastName: "Tremblay",
    email: "jean.tremblay@usherbrooke.ca",
    profilePictureUrl: null,
  },
  address: {
    noCivic: 123,
    street: "Rue Principale",
    city: "Sherbrooke",
    province: "Québec",
    country: "Canada",
    postalCode: "J1H 1A1",
  },
};

const mockOnSave = jest.fn();

const renderComponent = (user: UserInformation = mockUser) => {
  return render(<InformationsPersonnelles user={user} onSave={mockOnSave} />);
};

describe("InformationsPersonnelles Component", () => {
  beforeEach(() => {
    mockOnSave.mockClear();
  });

  describe("Rendering", () => {
    test("renders le titre", () => {
      renderComponent();
      expect(screen.getByText("Informations personnelles")).toBeInTheDocument();
    });

    test("renders les champs prénom et nom avec les bonnes valeurs", () => {
      renderComponent();
      expect(screen.getByDisplayValue("Jean")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Tremblay")).toBeInTheDocument();
    });

    test("renders le CIP désactivé", () => {
      renderComponent();
      const cipField = screen.getByDisplayValue("boum7113");
      expect(cipField).toBeDisabled();
    });

    test("renders le courriel désactivé", () => {
      renderComponent();
      const emailField = screen.getByDisplayValue("jean.tremblay@usherbrooke.ca");
      expect(emailField).toBeDisabled();
    });

    test("renders le bouton Enregistrer", () => {
      renderComponent();
      expect(screen.getByText("Enregistrer")).toBeInTheDocument();
    });
  });

  describe("Adresse", () => {
    test("renders le titre Adresse", () => {
      renderComponent();
      expect(screen.getByText("Adresse")).toBeInTheDocument();
    });

    test("renders les champs adresse avec les bonnes valeurs", () => {
      renderComponent();
      expect(screen.getByDisplayValue("123")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Rue Principale")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Sherbrooke")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Québec")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Canada")).toBeInTheDocument();
      expect(screen.getByDisplayValue("J1H 1A1")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    test("peut modifier le prénom", () => {
      renderComponent();
      const input = screen.getByDisplayValue("Jean");
      fireEvent.change(input, { target: { value: "Pierre" } });
      expect(screen.getByDisplayValue("Pierre")).toBeInTheDocument();
    });

    test("appelle onSave avec les bonnes valeurs au clic", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Enregistrer"));
      expect(mockOnSave).toHaveBeenCalledWith("Jean", "Tremblay", {
        noCivic: 123,
        street: "Rue Principale",
        city: "Sherbrooke",
        province: "Québec",
        country: "Canada",
        postalCode: "J1H 1A1",
      });
    });

    test("appelle onSave une seule fois", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Enregistrer"));
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });
});