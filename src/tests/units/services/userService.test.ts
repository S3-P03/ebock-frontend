import { fetchUser, fetchUserProfile, fetchUserStoreFront, updateUserPassword, updateUserProfile } from "services/userService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const token = "fake-token";
const logout = jest.fn();

describe("fetchUser", () => {

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

const mockUserInfoPerso = {
  user: {
    cip: "trej1234",
    firstName: "Jean",
    lastName: "Tremblay",
    email: "jean.tremblay@usherbrooke.ca",
    profilePictureUrl: null,
  },
  address: {
    civicNumber: 123,
    apptNumber: null,
    street: "Rue Principale",
    city: "Sherbrooke",
    postalCode: "J1H 1A1",
    provinceCode: "Québec",
    country: "Canada"
  },
};

const mockUserInfoForUpdate = {
  user: {
    firstName: "Jean",
    lastName: "Tremblay"
  },
  address: {
    civicNumber: 123,
    apptNumber: null,
    street: "Rue Principale",
    city: "Sherbrooke",
    postalCode: "J1H 1A1",
    provinceCode: "Québec",
    country: "Canada"
  },
};

describe("fetchAndModifyUserProfile", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchUserProfile", () => {
    test("retourne le profil utilisateur si succès", async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockUserInfoPerso });
      const result = await fetchUserProfile({ token, logout });
      expect(result).toEqual(mockUserInfoPerso);
    });

    test("rejette l'erreur", async () => {
      mockedApiClient.get.mockRejectedValue({
        response: { status: 500 },
        message: "Erreur réseau",
      });

      const result = await updateUserProfile({ token, logout }, mockUserInfoForUpdate);
      expect(result).toBeNull();
    });

    test("appelle le bon endpoint", async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockUserInfoPerso });
      await fetchUserProfile({ token, logout });
      expect(mockedApiClient.get).toHaveBeenCalledWith("/user/profile", {"headers": {"Authorization": "Bearer fake-token"}});
    });
  });

  describe("updateUserProfile", () => {
    test("retourne le profil mis à jour si succès", async () => {
      mockedApiClient.put.mockResolvedValue({ data: mockUserInfoPerso });
      const result = await updateUserProfile({ token, logout }, mockUserInfoForUpdate);
      expect(result).toEqual(mockUserInfoPerso);
    });

    test("rejette l'erreur", async () => {
      mockedApiClient.put.mockRejectedValue({
        response: { status: 500 },
        message: "Erreur réseau",
      });
      const result = await updateUserProfile({ token, logout }, mockUserInfoForUpdate);
      expect(result).toBeNull();
    });

    test("appelle le bon endpoint avec les bonnes données", async () => {
      mockedApiClient.put.mockResolvedValue({ data: mockUserInfoPerso });
      await updateUserProfile({ token, logout }, mockUserInfoForUpdate);
      expect(mockedApiClient.put).toHaveBeenCalledWith(
        expect.stringContaining("/profile"),
        mockUserInfoForUpdate,
        {"headers": {"Authorization": "Bearer fake-token"}}
      );
    });
  });

  describe("updateUserPassword", () => {
    const mockPasswordData = { oldPassword: "ancien", newPassword: "nouveau" };

    test("retourne true si succès", async () => {
      mockedApiClient.put.mockResolvedValue({ data: {} });
      const result = await updateUserPassword({ token, logout }, mockPasswordData);
      expect(result).toBe(true);
    });

    test("retourne false en cas d'erreur", async () => {
      mockedApiClient.put.mockRejectedValue({
        response: { status: 500 },
        message: "Erreur réseau",
      });
      const result = await updateUserPassword({ token, logout }, mockPasswordData);
      expect(result).toBe(false);
    });

    test("appelle le bon endpoint avec les bons mots de passe", async () => {
      mockedApiClient.put.mockResolvedValue({ data: {} });
      await updateUserPassword({ token, logout }, mockPasswordData);
      expect(mockedApiClient.put).toHaveBeenCalledWith(
        expect.stringContaining("/security"),
        mockPasswordData,
        {"headers": {"Authorization": "Bearer fake-token"}}
      );
    });
});
});