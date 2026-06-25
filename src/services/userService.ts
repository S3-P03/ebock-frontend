// services/userService.ts
import { SellerUser, SellerUserRaw } from "interfaces/Seller";
import { User, UserInformation } from "interfaces/User";
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

export async function fetchUserProfile(cip: string | undefined): Promise<UserInformation | null> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/profile`);
    const userInfo = (await response.data) as UserInformation;
    return userInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateUserProfile(cip: string | undefined, data: Partial<UserInformation>): Promise<UserInformation | null> {
  try {
    const response = await apiClient.put(`${SERVICE_BASE_URL}/${cip}/profile`, data);
    return response.data as UserInformation;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateUserPassword(cip: string | undefined, data: { currentPassword: string; newPassword: string }): Promise<boolean> {
  try {
    const response = await apiClient.put(`${SERVICE_BASE_URL}/${cip}/security`, data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}