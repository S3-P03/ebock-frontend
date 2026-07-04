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
  const response = await apiClient.get(`${SERVICE_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    logout();
    return null;
  }

  try {
    return (await response.data) as User;
  } catch (error) {
    if (response.status === 401) {
      emitApiError("Vous devez être connecté pour récupérer les informations de l'utilisateur", response.status);
    } else if (response.status === 404) {
      emitApiError("L'utilisateur n'existe pas", response.status);
    } else {
      emitApiError("Erreur lors de la récupération des informations de l'utilisateur", response.status);
    }
    console.error(error);
    return null;
  }
}

export async function fetchUserStoreFront(cip: string | undefined): Promise<SellerUser | null> {
  const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/storefront`);

  try {
    const rawSeller = (await response.data) as SellerUserRaw;
    const seller: SellerUser = {
      ...rawSeller,
      createdAt: new Date(rawSeller.createdAt),
    };
    return seller;
  } catch (error) {
    if (response.status === 404) {
      emitApiError("L'utilisateur n'existe pas", response.status);
    }
    return null;
  }
}

export async function fetchUserProfile({ token, logout }: FetchOptions): Promise<UserInformation | null> {
  const response = await apiClient.get(`${SERVICE_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  try {
    if (response.status === 401) {
      logout();
      return null;
    }

    const userInfo = (await response.data) as UserInformation;
    return userInfo;
  } catch (error) {
    if(response.status === 401) {
      emitApiError("Vous devez être connecté pour récupérer les informations de l'utilisateur", response.status);
    } else if(response.status === 404) {
      emitApiError("L'utilisateur n'existe pas", response.status);
    } else {
      emitApiError("Erreur lors de la récupération des informations personnelles de l'utilisateur", response.status);
    }
    return null;
  }
}

export async function updateUserProfile({ token, logout }: FetchOptions, data: Partial<UserUpdatePayload>): Promise<UserInformation | null> {
  const response = await apiClient.put(`${SERVICE_BASE_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });  

  try {
    if (response.status === 401) {
      logout();
      return null;
    }

    return response.data as UserInformation;
  } catch (error) {
    if(response.status === 401) {
      emitApiError("Vous devez être connecté pour mettre à jour les informations de l'utilisateur", response.status);
    } else if(response.status === 404) {
      emitApiError("L'utilisateur n'existe pas", response.status);
    } else {
      emitApiError("Erreur lors de la mise à jour des informations personnelles de l'utilisateur", response.status);
    }
    return null;
  }
}

export async function updateUserPassword({ token, logout }: FetchOptions, data: { oldPassword: string; newPassword: string }): Promise<string | boolean> {
  try {
    const response = await apiClient.put(`${SERVICE_BASE_URL}/security`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      logout();
      return "Vous devez être connecté pour mettre à jour le mot de passe";
    }

    return true;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      logout();
      emitApiError("Vous devez être connecté pour mettre à jour le mot de passe", error.response.status);
      return "Vous devez être connecté pour mettre à jour le mot de passe";
    }

    if (error?.response?.status === 400) {
      emitApiError("Le mot de passe actuel est incorrect", error.response.status);
      return "Le mot de passe actuel est incorrect";
    }

    emitApiError("Erreur lors de la mise à jour du mot de passe", error?.response?.status ?? 500);
    return "Erreur lors de la mise à jour du mot de passe";
  }
}