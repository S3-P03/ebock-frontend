import apiClient from "services/apiClient";
import { fetchUserList, enableUser, disableUser } from "services/adminService";
import { Users } from "interfaces/Admin";

jest.mock("services/apiClient");

const mockUsers: Users[] = [
    {
        cip: "u1",
        firstName: "Alice",
        lastName: "Smtesth",
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
        test("retourne la liste des utilisateurs en cas de succès", async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({
                status: 200,
                data: { utilisateurs: mockUsers },
            });

            const result = await fetchUserList({ token: "test-token", logout: jest.fn() });

            expect(apiClient.get).toHaveBeenCalledWith("/user/list", {
                headers: { Authorization: "Bearer test-token" },
            });
            expect(result).toEqual(mockUsers);
        });

        test("appelle logout et retourne null en cas de 401", async () => {
            const logout = jest.fn();
            (apiClient.get as jest.Mock).mockResolvedValue({
                status: 401,
                data: null,
            });

            const result = await fetchUserList({ token: "test-token", logout });

            expect(logout).toHaveBeenCalled();
            expect(result).toBeNull();
        });

        test("retourne null en cas d'échec", async () => {
            const error = new Error("server error");

            (apiClient.get as jest.Mock).mockRejectedValue(error);

            const result = await fetchUserList({token: "test-token", logout: jest.fn()});

            expect(result).toBeNull();
        });

        test("retourne un tableau vide si l'API renvoie une liste vide", async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({
                status: 200,
                data: { utilisateurs: [] },
            });

            const result = await fetchUserList({ token: "test-token", logout: jest.fn() });

            expect(result).toEqual([]);
        });
    });

    describe("enableUser", () => {
        test("appelle PUT sur /user/{cip}/enable avec le bon header et les bonnes données", async () => {
            const updatedUser: Users = { ...mockUsers[1], enabled: true };
            (apiClient.put as jest.Mock).mockResolvedValue({ status: 200, data: updatedUser });

            const result = await enableUser({ token: "test-token", logout: jest.fn() }, "u2", { enabled: true });

            expect(apiClient.put).toHaveBeenCalledWith(
                "/user/u2/enable",
                { enabled: true },
                { headers: { Authorization: "Bearer test-token" } }
            );
            expect(result).toEqual(updatedUser);
        });

        test("appelle logout et retourne null en cas de 401", async () => {
            const logout = jest.fn();
            (apiClient.put as jest.Mock).mockResolvedValue({ status: 401, data: null });

            const result = await enableUser({ token: "test-token", logout }, "u2", { enabled: true });

            expect(logout).toHaveBeenCalled();
            expect(result).toBeNull();
        });

        test("retourne null en cas d'échec", async () => {
            const error = new Error("server error");
            (apiClient.put as jest.Mock).mockRejectedValue(error);

            const result = await enableUser({ token: "test-token", logout: jest.fn() }, "u2", { enabled: true });

            expect(result).toBeNull();
        });

        test("fonctionne même si cip est undefined", async () => {
            (apiClient.put as jest.Mock).mockResolvedValue({ status: 200, data: mockUsers[0] });

            await enableUser({ token: "test-token", logout: jest.fn() }, undefined, { enabled: true });

            expect(apiClient.put).toHaveBeenCalledWith(
                "/user/undefined/enable",
                { enabled: true },
                { headers: { Authorization: "Bearer test-token" } }
            );
        });
    });

    describe("disableUser", () => {
        test("appelle PUT sur /user/{cip}/disable avec le bon header et les bonnes données", async () => {
            const updatedUser: Users = { ...mockUsers[0], enabled: false };
            (apiClient.put as jest.Mock).mockResolvedValue({ status: 200, data: updatedUser });

            const result = await disableUser({ token: "test-token", logout: jest.fn() }, "u1", { enabled: false });

            expect(apiClient.put).toHaveBeenCalledWith(
                "/user/u1/disable",
                { enabled: false },
                { headers: { Authorization: "Bearer test-token" } }
            );
            expect(result).toEqual(updatedUser);
        });

        test("appelle logout et retourne null en cas de 401", async () => {
            const logout = jest.fn();
            (apiClient.put as jest.Mock).mockResolvedValue({ status: 401, data: null });

            const result = await disableUser({ token: "test-token", logout }, "u1", { enabled: false });

            expect(logout).toHaveBeenCalled();
            expect(result).toBeNull();
        });

        test("retourne null en cas d'échec", async () => {
            const error = new Error("server error");
            (apiClient.put as jest.Mock).mockRejectedValue(error);

            const result = await disableUser({ token: "test-token", logout: jest.fn() }, "u1", { enabled: false });

            expect(result).toBeNull();
        });

        test("fonctionne même si cip est undefined", async () => {
            (apiClient.put as jest.Mock).mockResolvedValue({ status: 200, data: mockUsers[0] });

            await disableUser({ token: "test-token", logout: jest.fn() }, undefined, { enabled: false });

            expect(apiClient.put).toHaveBeenCalledWith(
                "/user/undefined/disable",
                { enabled: false },
                { headers: { Authorization: "Bearer test-token" } }
            );
        });
    });
});