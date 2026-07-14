import { renderHook } from '@testing-library/react';
import useAuthSession from 'hooks/useAuthSession';
import * as oidcModule from 'react-oidc-context';

jest.mock('react-oidc-context');

describe('useAuthSession hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('valid data -> user is authenticated', () => {
    const mockUseAuth = oidcModule.useAuth as jest.Mock;
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        access_token: 'jwt-token-test',
        profile: {
          cip: 'larj4236',
          email: 'larj4236@test.ca',
        },
      },
    });

    const { result } = renderHook(() => useAuthSession());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.token).toBe('jwt-token-test');
    expect(result.current.connectedUser.cip).toBe('larj4236');
    expect(result.current.connectedUser.email).toBe('larj4236@test.ca');
  });

  test('missing data -> user is not authenticated', () => {
    const mockUseAuth = oidcModule.useAuth as jest.Mock;
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });

    const { result } = renderHook(() => useAuthSession());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBe('');
    expect(result.current.connectedUser.cip).toBe('');
    expect(result.current.connectedUser.email).toBe('');
  });

  test('loading not done -> loading state detected', () => {
    const mockUseAuth = oidcModule.useAuth as jest.Mock;
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: undefined,
    });

    const { result } = renderHook(() => useAuthSession());

    expect(result.current.isLoading).toBe(true);
  });

  test('login and logout -> callable', () => {
    const mockSigninRedirect = jest.fn();
    const mockSignoutRedirect = jest.fn();

    const mockUseAuth = oidcModule.useAuth as jest.Mock;
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        access_token: 'token',
        profile: { cip: 'user123', email: 'user@example.com' },
      },
      signinRedirect: mockSigninRedirect,
      signoutRedirect: mockSignoutRedirect,
    });

    const { result } = renderHook(() => useAuthSession());

    // Call login
    result.current.login();
    expect(mockSigninRedirect).toHaveBeenCalled();

    // Call logout
    result.current.logout();
    expect(mockSignoutRedirect).toHaveBeenCalledWith({
      post_logout_redirect_uri: expect.any(String),
    });
  });
});