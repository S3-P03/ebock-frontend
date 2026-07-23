import { renderHook, waitFor } from '@testing-library/react';
import useWebSocket from 'hooks/useWebSocket';
import useAuthSession from 'hooks/useAuthSession';
import apiClient from 'services/apiClient';

jest.mock('hooks/useAuthSession');
jest.mock('services/apiClient', () => ({
  __esModule: true,
  default: { post: jest.fn() },
  isRedactedEbockEnvironment: jest.fn(() => false),
}));

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((err: unknown) => void) | null = null;
  onclose: (() => void) | null = null;
  close = jest.fn();

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }
}

describe('useWebSocket hook', () => {
  const mockUseAuthSession = useAuthSession as jest.Mock;
  const mockPost = apiClient.post as jest.Mock;
  const onMessage = jest.fn();

  beforeEach(() => {
    (global as any).WebSocket = MockWebSocket;
    MockWebSocket.instances = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('no token -> websocket is not opened', () => {
    mockUseAuthSession.mockReturnValue({ token: '' });

    renderHook(() => useWebSocket('ws://localhost/chat/5', onMessage));

    expect(mockPost).not.toHaveBeenCalled();
    expect(MockWebSocket.instances).toHaveLength(0);
  });

  test('valid token -> fetches ws-token with correct auth header', async () => {
    mockUseAuthSession.mockReturnValue({ token: 'jwt-token-test' });
    mockPost.mockResolvedValue({ data: { token: 'ws-ticket-abc', expiresInSeconds: 30 } });

    renderHook(() => useWebSocket('ws://localhost/chat/5', onMessage));

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));

    expect(mockPost).toHaveBeenCalledWith(
      '/ws-token',
      {},
      { headers: { Authorization: 'Bearer jwt-token-test', Environment: 'ebock' } }
    );
  });

  test('ws-token resolved -> opens WebSocket with encoded ticket in URL', async () => {
    mockUseAuthSession.mockReturnValue({ token: 'jwt-token-test' });
    mockPost.mockResolvedValue({ data: { token: 'ws-ticket-abc', expiresInSeconds: 30 } });

    renderHook(() => useWebSocket('ws://localhost/chat/5', onMessage));

    await waitFor(() => expect(MockWebSocket.instances).toHaveLength(1));

    expect(MockWebSocket.instances[0].url).toBe('ws://localhost/chat/5?wsToken=ws-ticket-abc');
  });

  test('ws-token containing special characters -> URL-encoded correctly', async () => {
    mockUseAuthSession.mockReturnValue({ token: 'jwt-token-test' });
    mockPost.mockResolvedValue({ data: { token: 'abc+def/ghi=', expiresInSeconds: 30 } });

    renderHook(() => useWebSocket('ws://localhost/chat/5', onMessage));

    await waitFor(() => expect(MockWebSocket.instances).toHaveLength(1));

    expect(MockWebSocket.instances[0].url).toBe(
      'ws://localhost/chat/5?wsToken=abc%2Bdef%2Fghi%3D'
    );
  });

  test('incoming message -> parsed JSON passed to onMessage callback', async () => {
    mockUseAuthSession.mockReturnValue({ token: 'jwt-token-test' });
    mockPost.mockResolvedValue({ data: { token: 'ws-ticket-abc', expiresInSeconds: 30 } });

    renderHook(() => useWebSocket('ws://localhost/chat/5', onMessage));

    await waitFor(() => expect(MockWebSocket.instances).toHaveLength(1));

    const socket = MockWebSocket.instances[0];
    socket.onmessage?.({ data: JSON.stringify({ content: 'hello' }) });

    expect(onMessage).toHaveBeenCalledWith({ content: 'hello' });
  });

  test('unmount after connection opened -> closes the socket', async () => {
    mockUseAuthSession.mockReturnValue({ token: 'jwt-token-test' });
    mockPost.mockResolvedValue({ data: { token: 'ws-ticket-abc', expiresInSeconds: 30 } });

    const { unmount } = renderHook(() => useWebSocket('ws://localhost/chat/5', onMessage));

    await waitFor(() => expect(MockWebSocket.instances).toHaveLength(1));

    const socket = MockWebSocket.instances[0];
    unmount();

    expect(socket.close).toHaveBeenCalled();
  });

  test('url changes -> fetches a new ticket and opens a new connection', async () => {
    mockUseAuthSession.mockReturnValue({ token: 'jwt-token-test' });
    mockPost.mockResolvedValue({ data: { token: 'ws-ticket-abc', expiresInSeconds: 30 } });

    const { rerender } = renderHook(({ url }) => useWebSocket(url, onMessage), {
      initialProps: { url: 'ws://localhost/chat/5' },
    });

    await waitFor(() => expect(MockWebSocket.instances).toHaveLength(1));

    rerender({ url: 'ws://localhost/chat/6' });

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(MockWebSocket.instances).toHaveLength(2));

    expect(MockWebSocket.instances[1].url).toBe('ws://localhost/chat/6?wsToken=ws-ticket-abc');
  });

  test('returned ref exposes the current WebSocket instance', async () => {
    mockUseAuthSession.mockReturnValue({ token: 'jwt-token-test' });
    mockPost.mockResolvedValue({ data: { token: 'ws-ticket-abc', expiresInSeconds: 30 } });

    const { result } = renderHook(() => useWebSocket('ws://localhost/chat/5', onMessage));

    await waitFor(() => expect(result.current.current).not.toBeNull());
    expect(result.current.current).toBe(MockWebSocket.instances[0]);
  });
});