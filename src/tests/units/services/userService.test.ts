import { fetchUser, fetchUserProfile, fetchUserStoreFront, updateUserPassword, updateUserProfile } from "services/userService";
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

const mockUserInfoPerso = {
  user: {
    cip: "trej1234",
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
      const result = await fetchUserProfile("trej1234");
      expect(result).toEqual(mockUserInfoPerso);
    });

    test("retourne null si erreur", async () => {
      mockedApiClient.get.mockRejectedValue(new Error("Erreur réseau"));
      const result = await fetchUserProfile("trej1234");
      expect(result).toBeNull();
    });

    test("appelle le bon endpoint", async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockUserInfoPerso });
      await fetchUserProfile("trej1234");
      expect(mockedApiClient.get).toHaveBeenCalledWith(expect.stringContaining("trej1234/profile"));
    });
  });

  describe("updateUserProfile", () => {
    test("retourne le profil mis à jour si succès", async () => {
      mockedApiClient.put.mockResolvedValue({ data: mockUserInfoPerso });
      const result = await updateUserProfile("trej1234", mockUserInfoPerso);
      expect(result).toEqual(mockUserInfoPerso);
    });

    test("retourne null si erreur", async () => {
      mockedApiClient.put.mockRejectedValue(new Error("Erreur réseau"));
      const result = await updateUserProfile("trej1234", mockUserInfoPerso);
      expect(result).toBeNull();
    });

    test("appelle le bon endpoint avec les bonnes données", async () => {
      mockedApiClient.put.mockResolvedValue({ data: mockUserInfoPerso });
      await updateUserProfile("trej1234", mockUserInfoPerso);
      expect(mockedApiClient.put).toHaveBeenCalledWith(
        expect.stringContaining("trej1234/profile"),
        mockUserInfoPerso
      );
    });
  });

  describe("updateUserPassword", () => {
    const mockPasswordData = { currentPassword: "ancien", newPassword: "nouveau" };

    test("retourne les données si succès", async () => {
      mockedApiClient.put.mockResolvedValue({ data: mockPasswordData });
      const result = await updateUserPassword("trej1234", mockPasswordData);
      expect(result).toEqual(mockPasswordData);
    });

    test("retourne null si erreur", async () => {
      mockedApiClient.put.mockRejectedValue(new Error("Erreur réseau"));
      const result = await updateUserPassword("trej1234", mockPasswordData);
      expect(result).toBeNull();
    });

    test("appelle le bon endpoint avec les bons mots de passe", async () => {
      mockedApiClient.put.mockResolvedValue({ data: mockPasswordData });
      await updateUserPassword("trej1234", mockPasswordData);
      expect(mockedApiClient.put).toHaveBeenCalledWith(
        expect.stringContaining("trej1234/security"),
        mockPasswordData
      );
    });
  });
});