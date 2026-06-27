import { render, screen, fireEvent } from "@testing-library/react";
import MenuBar from "components/MenuBar";
import { BrowserRouter } from "react-router-dom";
import * as authModule from "hooks/useAuthSession";

jest.mock('hooks/useAuthSession');

const setupMockAuth = (logout = jest.fn()) => {
  const mockUseAuthSession = authModule.default as jest.Mock;
  mockUseAuthSession.mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    connectedUser: { cip: 'larj4236', email: 'larj4236@usherbrooke.ca' },
    token: 'test-token',
    login: jest.fn(),
    logout,
  });
};

const mockUser = {
  cip: "larj4236",
  firstName: "Jeef",
  lastName: "Larouche",
  email: "larj4236@usherbrooke.ca",
  profilePictureUrl: "",
};

const renderMenuBar = (user = mockUser) => {
  return render(
    <BrowserRouter>
      <MenuBar user={user} />
    </BrowserRouter>
  );
};

describe('MenuBar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test Group 1: Rendering
  describe('Rendering', () => {
    test('renders EBOCK title', () => {
      setupMockAuth();
      renderMenuBar();
      
      expect(screen.getByText('EBOCK')).toBeInTheDocument();
    });

    test('avatar alt -> user full name', () => {
      setupMockAuth();
      renderMenuBar(mockUser);
      
      const avatar = screen.getByRole('img', { hidden: true });
      expect(avatar).toHaveAttribute('alt', 'Jeef Larouche');
    });

    test('undefined user -> handled', () => {
      setupMockAuth();
      renderMenuBar({ cip: '', firstName: '', lastName: '', email: '', profilePictureUrl: '' });
      
      const avatar = screen.getByRole('img', { hidden: true });
      expect(avatar).toHaveAttribute('alt', ' ');
    });
  });

  // Test Group 2: Interactions
  describe('Menu Interactions', () => {
    test('click on avatar -> menu opened', () => {
      setupMockAuth();
      renderMenuBar();

      // Initially closed
      expect(screen.queryByText('Profil')).not.toBeVisible();
      expect(screen.queryByText('Déconnexion')).not.toBeVisible();

      // Click avatar to open
      const avatarButton = screen.getAllByRole('button')[1];
      fireEvent.click(avatarButton);

      // Now opened
      expect(screen.getByText('Profil')).toBeVisible();
      expect(screen.getByText('Déconnexion')).toBeVisible();
    });
  });

  // Test Group 3: Logout
  describe('Logout', () => {
    test('Deconnexion clicked -> calls logout', () => {
      const mockLogout = jest.fn();
      setupMockAuth(mockLogout);
      renderMenuBar();

      // Open menu
      const avatarButton = screen.getAllByRole('button')[1];
      fireEvent.click(avatarButton);

      // Click logout
      const logoutButton = screen.getByText('Déconnexion');
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    test('logout button -> clickable', () => {
      setupMockAuth();
      renderMenuBar();

      // Open menu
      const avatarButton = screen.getAllByRole('button')[1];
      fireEvent.click(avatarButton);

      const logoutButton = screen.getByText('Déconnexion');
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton.closest('li')).toHaveClass('MuiMenuItem-root');
    });
  });

  // Test Group 4: Profile
  describe('Profile', () => {
    test('profile button -> clickable', () => {
      setupMockAuth();
      renderMenuBar();

      // Open menu
      const avatarButton = screen.getAllByRole('button')[1];
      fireEvent.click(avatarButton);

      const profileButton = screen.getByText('Profil');
      expect(profileButton).toBeInTheDocument();
      expect(profileButton.closest('li')).toHaveClass('MuiMenuItem-root');

      fireEvent.click(profileButton);
      expect(profileButton).toBeInTheDocument();
    });
  });
});