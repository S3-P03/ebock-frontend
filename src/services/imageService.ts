import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/image";

export async function fetchImage(guid: string | undefined): Promise<string | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${guid}`, {
        responseType: 'blob'
    });

  try {
    return(URL.createObjectURL(response.data));
  } catch (error) {
    emitApiError("Image impossible à récupérer", response.status);
    return null;
  }
}

export async function uploadImageFile(file: File, token: string): Promise<{guid: string} | undefined> {
  const response = await apiClient.post(`${SERVICE_BASE_URL}`, {
      file
  },
  {
      headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
      },   
  });

  try {
    return(response.data) as {guid: string};
  } catch (error) {
    emitApiError("Erreur lors du chargement de l'image, veuillez vérifier l'extension", response.status);
    return undefined;
  }
}