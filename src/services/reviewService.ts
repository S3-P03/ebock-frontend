import apiClient from "./apiClient";

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
  } catch (error) {
    console.error("Erreur fetchReviewAverage :", error);
    return null;
  }
}

export async function fetchReviewDetails(cip: string | undefined): Promise<ReviewDetail[] | null> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/details`);
    return response.data as ReviewDetail[];
  } catch (error) {
    console.error("Erreur fetchReviewDetails :", error);
    return null;
  }
}