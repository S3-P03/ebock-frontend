// services/userService.ts
import { SellerUser, SellerUserRaw } from "interfaces/Seller";
import { User, UserInformation, UserUpdatePayload } from "interfaces/User";
import apiClient from "./apiClient";

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
    console.error(error);
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
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
    
    if (response.status === 401) {
      logout();
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}