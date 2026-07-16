// services/userService.ts
import { SellerUser, SellerUserRaw } from "interfaces/Seller";
import { User, UserInformation, UserUpdatePayload } from "interfaces/User";
import apiClient, { emitApiError } from "./apiClient";

interface FetchOptions {
  token: string;
  logout: () => void;
}

const SERVICE_BASE_URL = "/user";

const API_BASE_URL = process.env.REACT_APP_API_URL;

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

    let user = (await response.data) as User;
    user.profilePictureUrl = response.data.profilePictureGuid ? `${API_BASE_URL}/image/${response.data.profilePictureGuid}` : null;

    return user;
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
      profilePictureUrl: response.data.profilePictureGuid ? `${API_BASE_URL}/image/${response.data.profilePictureGuid}` : null,
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

    let userInfo = (await response.data) as UserInformation;
    userInfo.user.profilePictureUrl = response.data.user.profilePictureGuid ? `${API_BASE_URL}/image/${response.data.user.profilePictureGuid}` : null;
    
    return userInfo;
  } catch (error: any) {
    if(error.status === 401) {
      emitApiError("Vous devez être connecté pour récupérer les informations de l'utilisateur", error.status);
      logout();
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
    await apiClient.put(`${SERVICE_BASE_URL}/security`, data, {
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
}

export async function updateUserProfilePicture({ token, logout }: FetchOptions, data: { guid: string }): Promise<string | null> {
  try {
    await apiClient.put(`${SERVICE_BASE_URL}/updateProfilePicture`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.guid ? `${API_BASE_URL}/image/${data.guid}` : null;
  } catch (error: any) {
    let errorMsg = "Erreur lors de la mise à jour de la photo de profil";
    if (error.status === 400) {
      errorMsg = "La photo de profil n'est pas valide";
    } else if (error.status === 401) {
      errorMsg = "Vous devez être connecté pour mettre à jour la photo de profil";
      logout();
    } else if (error.status === 403) {
      errorMsg = "Vous n'avez pas les droits pour mettre à jour la photo de profil";
    }

    emitApiError(errorMsg, error.status ?? 500);
    return null;
  }
}