import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import * as authModule from './hooks/useAuthSession';

jest.mock('./hooks/useAuthSession');

test('renders spinner while loading', () => {
  const mockUseAuthSession = authModule.default as jest.Mock;
  mockUseAuthSession.mockReturnValue({
    isAuthenticated: false,
    isLoading: true,
    connectedUser: { cip: '', email: '' },
    token: '',
    login: jest.fn(),
    logout: jest.fn(),
  });
  
  const { container } = render(<App />);
  const spinner = container.querySelector('.spinner');
  expect(spinner).toBeInTheDocument();
  expect(spinner).toHaveClass('spinner');
});
