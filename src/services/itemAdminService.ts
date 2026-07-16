import apiClient, { emitApiError } from "./apiClient";
import { Users } from "interfaces/Admin";

interface FetchOptions {
  token: string;
  logout: () => void;
}

const SERVICE_BASE_URL = "/item";

export async function banItem({ token, logout }: FetchOptions, itemId: string | number): Promise<boolean> {
    if (!itemId) return false;
    
    try {
        await apiClient.delete(`${SERVICE_BASE_URL}/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return true; 
    } catch (error: any) {
        const status = error.response?.status;

        if (status === 401) {
            logout();
            return false;
        } 
        
        if (status === 403) {
            emitApiError("Vous n'avez pas les autorisations pour bannir cet item.", 403);
            return false;
        }

        emitApiError("Erreur lors du bannissement de l'item.", status ?? 500);
        return false;
    }
}