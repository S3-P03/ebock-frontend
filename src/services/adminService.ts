import apiClient from "./apiClient";
import { Users } from "interfaces/AdminUserList";
const SERVICE_BASE_URL = "/user";

export async function fetchUserList() {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);
    return response.data.utilisateurs as Users[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function enableUser(cip: string | undefined, data: Partial<Users>) {

    try {
        const response = await apiClient.put(`${SERVICE_BASE_URL}/${cip}/enable`, data, {});  
        return response.data as Users;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function disableUser(cip: string | undefined, data: Partial<Users>) {

    try {
        const response = await apiClient.put(`${SERVICE_BASE_URL}/${cip}/disable`, data, {});  
        return response.data as Users;
    } catch (error) {
        console.error(error);
        return null;
    }
}
