import apiClient, { emitApiError } from "./apiClient";
import { Users } from "interfaces/Admin";
import { SpecificationInfo } from "interfaces/Specification";

interface FetchOptions {
  token: string;
  logout: () => void;
}

const SERVICE_BASE_URL = "/user";

export async function fetchUserList({ token, logout }: FetchOptions): Promise<Users[] | null> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }
    const userInfo = response.data.utilisateurs as Users[];
    return userInfo;
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des utilisateurs", error.status ?? 500);
    return null;
  }
}

export async function enableUser({ token, logout }: FetchOptions,cip: string | undefined, data: Partial<Users>) {
    try {
        const response = await apiClient.put(`${SERVICE_BASE_URL}/${cip}/enable`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return null;
        } 
        return response.data as Users;
    } catch (error: any) {
        emitApiError("Erreur lors de l'activation de l'utilisateur", error.status ?? 500);
        return null;
  }
}

export async function disableUser({ token, logout }: FetchOptions, cip: string | undefined, data: Partial<Users>) {

    try {
        const response = await apiClient.put(`${SERVICE_BASE_URL}/${cip}/disable`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return null;
        }
        return response.data as Users;
    } catch (error: any) {
        emitApiError("Erreur lors de la désactivation de l'utilisateur", error.status ?? 500);
        return null;
    }
}