import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/image";

export async function fetchImage(guid: string | undefined): Promise<string | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${guid}`, {
        responseType: 'blob'
    });

  try {
    return(URL.createObjectURL(response.data));
  } catch (error) {
    console.error(error);
    return null;
  }
}