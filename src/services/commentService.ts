import apiClient, { emitApiError } from "./apiClient";
import { CommentDetail } from "interfaces/Comment";

const SERVICE_BASE_URL = "/comment";

export async function fetchComments(id: string | undefined): Promise<CommentDetail[] | null> {
    try {
        const response = await apiClient.get(`/item/${id}/comment`);
        return response.data as CommentDetail[];
    } catch (error: any) {
        emitApiError(error.message, error.response?.status ?? 500);
        return null;
    }
}

export async function postComment(
    id: string | undefined,
    content: string,
    idParent: number | null,
    token: string
): Promise<number> {
    try {
        const response = await apiClient.post(`/item/${id}/comment`, { content, idParent }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status;
    } catch (error: any) {
        emitApiError(error.message, error.response?.status ?? 500);
        return error.response?.status ?? 500;
    }
}

export async function deleteComment(
    id: number,
    token: string
): Promise<number> {
    try {
        const response = await apiClient.delete(`${SERVICE_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status;
    } catch (error: any) {
        emitApiError(error.message, error.response?.status ?? 500);
        return error.response?.status ?? 500;
    }
}