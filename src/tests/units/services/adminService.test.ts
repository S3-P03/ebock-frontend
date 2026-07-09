import apiClient from "services/apiClient";
import { fetchUserList, enableUser, disableUser } from "services/adminService";
import { Users } from "interfaces/Admin";

jest.mock("services/apiClient");

const mockUsers: Users[] = [
    {
        cip: "u1",
        firstName: "Alice",
        lastName: "Smith",
        email: "alice.smith@example.com",
        enabled: true,
    },
    {
        cip: "u2",
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob.johnson@example.com",
        enabled: false,
    },
];

describe("adminService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
});

describe("fetchUserList", () => {
    it("retourne la liste des utilisateurs en cas de succès", async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: { utilisateurs: mockUsers },
        });

        const result = await fetchUserList({ token: "test-token", logout: jest.fn() });

        expect(apiClient.get).toHaveBeenCalledWith("/user/list", {
        headers: {
            Authorization: "Bearer test-token",
        },
        });
        expect(result).toEqual(mockUsers);
    });

    it("retourne null et logue l'erreur en cas d'échec", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const error = new Error("network error");
        (apiClient.get as jest.Mock).mockRejectedValue(error);

        const result = await fetchUserList({ token: "test-token", logout: jest.fn() });

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(error);
        consoleSpy.mockRestore();
    });

    it("retourne un tableau vide si l'API renvoie une liste vide", async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({
            data: { utilisateurs: [] },
        });

        const result = await fetchUserList({ token: "test-token", logout: jest.fn() });

        expect(result).toEqual([]);
    });
});

describe("enableUser", () => {
    it("appelle PUT sur /user/{cip}/enable avec les bonnes données", async () => {
        const updatedUser: Users = { ...mockUsers[1], enabled: true };
        (apiClient.put as jest.Mock).mockResolvedValue({ data: updatedUser });

        const result = await enableUser("u2", { enabled: true });

        expect(apiClient.put).toHaveBeenCalledWith(
            "/user/u2/enable",
            { enabled: true },
            {}
        );
        expect(result).toEqual(updatedUser);
    });

    it("retourne null et logue l'erreur en cas d'échec", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const error = new Error("server error");
        (apiClient.put as jest.Mock).mockRejectedValue(error);

        const result = await enableUser("u2", { enabled: true });

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(error);
        consoleSpy.mockRestore();
    });

    it("fonctionne même si cip est undefined", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: mockUsers[0] });

        await enableUser(undefined, { enabled: true });

        expect(apiClient.put).toHaveBeenCalledWith(
            "/user/undefined/enable",
            { enabled: true },
            {}
        );
    });
  });

  describe("disableUser", () => {
    it("appelle PUT sur /user/{cip}/disable avec les bonnes données", async () => {
        const updatedUser: Users = { ...mockUsers[0], enabled: false };
        (apiClient.put as jest.Mock).mockResolvedValue({ data: updatedUser });

        const result = await disableUser("u1", { enabled: false });

        expect(apiClient.put).toHaveBeenCalledWith(
            "/user/u1/disable",
            { enabled: false },
            {}
        );
        expect(result).toEqual(updatedUser);
    });

    it("retourne null et logue l'erreur en cas d'échec", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const error = new Error("server error");
        (apiClient.put as jest.Mock).mockRejectedValue(error);

        const result = await disableUser("u1", { enabled: false });

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(error);
        consoleSpy.mockRestore();
    });

    it("fonctionne même si cip est undefined", async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: mockUsers[0] });

        await disableUser(undefined, { enabled: false });

        expect(apiClient.put).toHaveBeenCalledWith(
            "/user/undefined/disable",
            { enabled: false },
            {}
        );
    });
  });
});