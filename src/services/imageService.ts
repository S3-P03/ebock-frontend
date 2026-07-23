import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/image";

export async function fetchImage(guid: string | undefined): Promise<string | null> {
  
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${guid}`, {
      responseType: 'blob'
    });
    return(URL.createObjectURL(response.data));
  } catch (error: any) {
    emitApiError("Image impossible à récupérer", error.status);
    return null;
  }
}

export async function uploadImageFile(file: File, token: string): Promise<{guid: string} | undefined> {
  try {
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
    return(response.data) as {guid: string};
  } catch (error: any) {
    emitApiError("Erreur lors du chargement de l'image, veuillez vérifier l'extension", error.status);
    return undefined;
  }
}