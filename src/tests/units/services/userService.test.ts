import { fetchUser, fetchUserStoreFront } from "services/userService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("fetchUser", () => {
  const token = "fake-token";
  const logout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the user when the request succeeds", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@test.com",
    };

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockUser,
    });

    const result = await fetchUser({ token, logout });

    expect(apiClient.get).toHaveBeenCalledWith("/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(result).toEqual(mockUser);
    expect(logout).not.toHaveBeenCalled();
  });

  test("logs out and returns null when status is 401", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 401,
      data: null,
    });

    const result = await fetchUser({ token, logout });

    expect(logout).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });
});

describe("fetchUserStoreFront", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("converts createdAt to a Date", async () => {
    const rawSeller = {
      cip: "larj4236",
      name: "Seller",
      createdAt: "2026-06-18T12:00:00Z",
    };

    mockedApiClient.get.mockResolvedValue({
      data: rawSeller,
    });

    const result = await fetchUserStoreFront("larj4236");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/user/larj4236/storefront"
    );

    expect(result).toEqual({
      ...rawSeller,
      createdAt: new Date(rawSeller.createdAt),
    });

    expect(result?.createdAt).toBeInstanceOf(Date);
  });
});