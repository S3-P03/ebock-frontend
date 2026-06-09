// services/userService.ts
import { User } from "../interfaces/User";
import apiClient from "./apiClient";

interface FetchOptions {
  token: string;
  logout: () => void;
}

export async function fetchUser({ token, logout }: FetchOptions): Promise<User | null> {
  const response = await apiClient.get("/user/me", {
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