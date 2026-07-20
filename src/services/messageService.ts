import { Message, MessageRaw, Room } from "interfaces/Message";
import apiClient, { emitApiError, API_BASE_URL } from "./apiClient";

const SERVICE_BASE_URL = "/message";

function transformRoomProfilePics(room: any): Room {
    return {
        ...room,
        sellerProfilePicUrl: room.sellerProfilePicGuid ? `${API_BASE_URL}/image/${room.sellerProfilePicGuid}` : room.sellerProfilePicUrl,
        buyerProfilePicUrl: room.buyerProfilePicGuid ? `${API_BASE_URL}/image/${room.buyerProfilePicGuid}` : room.buyerProfilePicUrl,
    };
}

export async function createRoom({itemId, buyerCip, token} : {itemId: number, buyerCip: string, token: string}) : Promise<Room | null> {

    try {
        const response = await apiClient.post(`${SERVICE_BASE_URL}/room`,
            {
                itemId, buyerCip
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },   
            }
        );
        return (await response.data) as Room;
    } catch (error: any) {
        if(error.status === 401) {
            emitApiError("Vous devez être connecté pour créer une salle", error.status);
        } else if(error.status === 404) {
            emitApiError("L'item ou l'utilisateur n'existe pas", error.status);
        } else {
            emitApiError("Erreur lors de la création de la salle", error.status);
        }
        return null;
    }
}

export async function postMessage({content, senderCip, roomId, token} : {content: string, senderCip: string, roomId: string, token: string}) : Promise<Message | null> {

    try {
        const response = await apiClient.post(`${SERVICE_BASE_URL}/room/${roomId}`,
            {
                content, senderCip
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },   
            }
        );
        return (await response.data) as Message;
    } catch (error: any) {
        if(error.status === 401) {
            emitApiError("Vous devez être connecté pour envoyer un message", error.status);
        } else if(error.status === 404) {
            emitApiError("La salle ou l'utilisateur n'existe pas", error.status);
        } else {
            emitApiError("Erreur lors de l'envoi du message", error.status);
        }
        return null;
    }
}

export async function fetchMessages(roomId: string | undefined, token: string): Promise<MessageRaw[] | null> {

    try {
        const response = await apiClient.get(`${SERVICE_BASE_URL}/room/${roomId}/messages`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return (await response.data) as MessageRaw[];
    } catch (error: any) {
        if(error.status === 401) {
            emitApiError("Vous devez être connecté pour récupérer les messages", error.status);
        } else if(error.status === 404) {
            emitApiError("La salle ou l'utilisateur n'existe pas", error.status);
        } else {
            emitApiError("Erreur lors de la récupération des messages", error.status);
        }
        return null;
    }
}

export async function fetchRoom(roomId: string | undefined, token: string): Promise<Room | null> {
  
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/room/${roomId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return transformRoomProfilePics(await response.data);
  } catch (error: any) {
    if(error.status === 401) {
      emitApiError("Vous devez être connecté pour récupérer les informations de la salle", error.status);
    } else if(error.status === 404) {
      emitApiError("La salle ou l'utilisateur n'existe pas", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des informations de la salle", error.status);
    }
    return null;
  }
}

export async function fetchUserRooms(token: string): Promise<Room[] | null> {
  
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/room`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const rooms = await response.data as any[];
    return rooms.map(transformRoomProfilePics);
  } catch (error: any) {
    if(error.status === 401) {
      emitApiError("Vous devez être connecté pour récupérer les salles", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des salles", error.status);
    }
    return null;
  }
}