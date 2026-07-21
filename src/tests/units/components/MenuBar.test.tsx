import { render, screen, fireEvent } from "@testing-library/react";
import MenuBar from "components/MenuBar";
import { BrowserRouter } from "react-router-dom";
import * as authModule from "hooks/useAuthSession";
import { jwtDecode } from "jwt-decode";

jest.mock('hooks/useAuthSession');
jest.mock('jwt-decode', () => ({
  __esModule: true,
  jwtDecode: jest.fn(() => ({
    realm_access: {
      roles: ['user', 'admin'],
    },
  })),
}));

const setupMockAuth = (logout = jest.fn(), admin = true) => {
  const mockUseAuthSession = authModule.default as jest.Mock;
  const mockedJwtDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>;

  mockedJwtDecode.mockReturnValue({
    realm_access: {
      roles: ['user', admin ? 'admin' : null].filter(Boolean) as string[],
    },
  } as any);

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
  profilePictureUrl: "https://example.com/profile.jpg",
};

const renderMenuBar = (user = mockUser) => {
  return render(
    <BrowserRouter>
      <MenuBar user={user} darkMode={false} setDarkMode={() => {}} />

    </BrowserRouter>
  );
};

const renderNullUserMenuBar = () => {
  return render(
    <BrowserRouter>
      <MenuBar user={null} darkMode={false} setDarkMode={() => {}} />
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

    test('avatar alt is user full name', () => {
      setupMockAuth();
      renderMenuBar(mockUser);
      
      const avatar = screen.getByRole('img', { hidden: true });
      expect(avatar).toHaveAttribute('alt', 'Jeef Larouche');
    });

    test('undefined user is handled', () => {
      setupMockAuth();
      renderNullUserMenuBar();
      
      const avatar = screen.queryByRole('img', { hidden: true });
      expect(avatar).not.toBeInTheDocument();
    });
  });

  // Test Group 2: Interactions
  describe('Menu Interactions', () => {
    test('click on avatar -> menu opened', () => {
      setupMockAuth();
      renderMenuBar();

      // Initially closed
      expect(screen.queryByText('Profil')).not.toBeVisible();
      expect(screen.queryByText('Mon étalage')).not.toBeVisible();
      expect(screen.queryByText('Admin - Tableau de bord')).not.toBeVisible();
      expect(screen.queryByText('Déconnexion')).not.toBeVisible();

      // Click avatar to open
      const avatarButton = screen.getAllByRole('button')[2];
      fireEvent.click(avatarButton);

      // Now opened
      expect(screen.getByText('Profil')).toBeVisible();
      expect(screen.getByText('Mon étalage')).toBeVisible();
      expect(screen.getByText('Admin - Tableau de bord')).toBeVisible();
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

  // Test Group 5: Admin
  describe('Admin', () => {
    test('admin button -> clickable', () => {
      setupMockAuth();
      renderMenuBar();

      // Open menu
      const avatarButton = screen.getAllByRole('button')[1];
      fireEvent.click(avatarButton);

      const adminButton = screen.getByText('Admin - Tableau de bord');
      expect(adminButton).toBeInTheDocument();
      expect(adminButton.closest('li')).toHaveClass('MuiMenuItem-root');

      fireEvent.click(adminButton);
      expect(adminButton).toBeInTheDocument();
    });

    test('not admin -> no admin button displaying', () => {
      setupMockAuth(undefined, false);
      renderMenuBar();

      // Open menu
      const avatarButton = screen.getAllByRole('button')[1];
      fireEvent.click(avatarButton);

      expect(screen.queryByText('Admin - Tableau de bord')).not.toBeInTheDocument();
    });
  });
});