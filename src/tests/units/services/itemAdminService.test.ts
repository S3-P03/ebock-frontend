import { banItem } from "services/itemAdminService";
import apiClient, { emitApiError } from "services/apiClient";

jest.mock("services/apiClient", () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
    emitApiError: jest.fn(),
}));
 
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockedEmitApiError = emitApiError as jest.MockedFunction<typeof emitApiError>;
 
describe("banItem Service", () => {
    const mockToken = "fake-jwt-token";
    const mockLogout = jest.fn();
    const mockItemId = "123";
 
    const fetchOptions = {
        token: mockToken,
        logout: mockLogout,
    };
 
    beforeEach(() => {
        jest.clearAllMocks();
    });
 
    test("returns true and sends correct headers when the request succeeds", async () => {
        mockedApiClient.delete.mockResolvedValue({ status: 200 });
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(mockedApiClient.delete).toHaveBeenCalledWith(`/item/${mockItemId}`, {
            headers: { Authorization: `Bearer ${mockToken}` },
        });
        expect(result).toBe(true);
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockedEmitApiError).not.toHaveBeenCalled();
    });
 
    test("bloque l'exécution et ne fait aucun appel réseau si itemId est manquant", async () => {
        // Ensures the service protects the backend from empty ID strings
        const result = await banItem(fetchOptions, "");
 
        expect(mockedApiClient.delete).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
 
    test("returns false and calls logout on 401 Unauthorized", async () => {
        mockedApiClient.delete.mockRejectedValue({ response: { status: 401 } });
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(result).toBe(false);
        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockedEmitApiError).not.toHaveBeenCalled();
    });
 
    test("returns false and emits 403 error on Forbidden", async () => {
        mockedApiClient.delete.mockRejectedValue({ response: { status: 403 } });
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(result).toBe(false);
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockedEmitApiError).toHaveBeenCalledWith(
            "Vous n'avez pas les autorisations pour bannir cet item.",
            403
        );
    });
 
    test("returns false and emits error with status code on generic API failure", async () => {
        mockedApiClient.delete.mockRejectedValue({ response: { status: 404 } });
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(result).toBe(false);
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockedEmitApiError).toHaveBeenCalledWith(
            "Erreur lors du bannissement de l'item.",
            404
        );
    });
 
    test("returns false and emits 500 on network error without response status", async () => {
        mockedApiClient.delete.mockRejectedValue(new Error("Network timeout"));
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(result).toBe(false);
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockedEmitApiError).toHaveBeenCalledWith(
            "Erreur lors du bannissement de l'item.",
            500
        );
    });
});