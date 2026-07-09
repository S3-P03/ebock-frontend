import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/review";

export interface ReviewAverage {
  avgRating: number;
  nbrReviews: number;
}

export interface ReviewDetail {
  firstName: string;
  lastName: string;
  profilPictureGuid: string;
  content: string;
  timestamp: string;
  rating: number;
}

export async function fetchReviewAverage(cip: string | undefined): Promise<ReviewAverage | null> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/average`);
    return response.data as ReviewAverage;
  } catch (error: any) {
    handleReviewError(error);
    return null;
  }
}

export async function fetchReviewDetails(cip: string | undefined): Promise<ReviewDetail[] | null> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/details`);
    return response.data as ReviewDetail[];
  } catch (error: any) {
    handleReviewError(error);
    return null;
  }
}

function handleReviewError(error: any) {
  if (error.status === 404) {
    emitApiError("L'utilisateur n'existe pas", 404);
  } else {
    emitApiError("Erreur lors de la récupération des avis", error.status ?? 500);
  }
}