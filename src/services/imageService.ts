import apiClient from "./apiClient";

export async function fetchImage(guid: string | undefined): Promise<string | null> {
    const response = await apiClient.get(`/image/${guid}`, {
        responseType: 'blob'
    });

  try {
    return(URL.createObjectURL(response.data));
  } catch (error) {
    console.error(error);
    return null;
  }
}