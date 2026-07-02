// services/userService.ts
import { SellerUser, SellerUserRaw } from "interfaces/Seller";
import { User, UserInformation, UserUpdatePayload } from "interfaces/User";
import apiClient, { emitApiError } from "./apiClient";

interface FetchOptions {
  token: string;
  logout: () => void;
}

const SERVICE_BASE_URL = "/user";

export async function fetchUser({ token, logout }: FetchOptions): Promise<User | null> {
  
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      logout();
      return null;
    }
    return (await response.data) as User;
  } catch (error: any) {
    if (error.status === 401) {
      emitApiError("Vous devez être connecté pour récupérer les informations de l'utilisateur", error.status);
    } else if (error.status === 404) {
      emitApiError("L'utilisateur n'existe pas", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des informations de l'utilisateur", error.status);
    }
    return null;
  }
}

export async function fetchUserStoreFront(cip: string | undefined): Promise<SellerUser | null> {

  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/storefront`);
    const rawSeller = (await response.data) as SellerUserRaw;
    const seller: SellerUser = {
      ...rawSeller,
      createdAt: new Date(rawSeller.createdAt),
    };
    return seller;
  } catch (error: any) {
    if (error.status === 404) {
      emitApiError("L'utilisateur n'existe pas", error.status);
    } else {
      emitApiError("Erreur lors de la récupération du profil vendeur", error.status);
    }
    return null;
  }
}

export async function fetchUserProfile({ token, logout }: FetchOptions): Promise<UserInformation | null> {
  
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }

    const userInfo = (await response.data) as UserInformation;
    return userInfo;
  } catch (error: any) {
    if(error.status === 401) {
      emitApiError("Vous devez être connecté pour récupérer les informations de l'utilisateur", error.status);
    } else if(error.status === 404) {
      emitApiError("L'utilisateur n'existe pas", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des informations personnelles de l'utilisateur", error.status);
    }
    return null;
  }
}

export async function updateUserProfile({ token, logout }: FetchOptions, data: Partial<UserUpdatePayload>): Promise<UserInformation | null> {
  
  try {
    const response = await apiClient.put(`${SERVICE_BASE_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });  
    if (response.status === 401) {
      logout();
      return null;
    }

    return response.data as UserInformation;
  } catch (error: any) {
    if(error.status === 401) {
      emitApiError("Vous devez être connecté pour mettre à jour les informations de l'utilisateur", error.status);
    } else if(error.status === 404) {
      emitApiError("L'utilisateur n'existe pas", error.status);
    } else {
      emitApiError("Erreur lors de la mise à jour des informations personnelles de l'utilisateur", error.status);
    }
    return null;
  }
}

export async function updateUserPassword({ token, logout }: FetchOptions, data: { oldPassword: string; newPassword: string }): Promise<boolean> {
  try {
    const response = await apiClient.put(`${SERVICE_BASE_URL}/security`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error: any) {
    if (error.status === 400 || error.status === 401) {
      emitApiError("Le mot de passe actuel est incorrect", error.status);
      return false;
    }

    emitApiError("Erreur lors de la mise à jour du mot de passe", error.status ?? 500);
    return false;
  }

  return true;
}