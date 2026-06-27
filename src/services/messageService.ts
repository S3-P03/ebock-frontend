import { Message, MessageRaw, Room } from "interfaces/Message";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/message";

export async function createRoom({itemId, buyerCip, token} : {itemId: number, buyerCip: string, token: string}) : Promise<Room | null> {

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

    try {
        return (await response.data) as Room;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function postMessage({content, senderCip, roomId, token} : {content: string, senderCip: string, roomId: string, token: string}) : Promise<Message | null> {
    
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

    try {
        return (await response.data) as Message;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchMessages(roomId: string | undefined, token: string): Promise<MessageRaw[] | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/room/${roomId}/messages`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    try {
        return (await response.data) as MessageRaw[];
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchRoom(roomId: string | undefined, token: string): Promise<Room | null> {
  const response = await apiClient.get(`${SERVICE_BASE_URL}/room/${roomId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

  try {
    return (await response.data) as Room;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchUserRooms(token: string): Promise<Room[] | null> {
  const response = await apiClient.get(`${SERVICE_BASE_URL}/room`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

  try {
    return (await response.data) as Room[];
  } catch (error) {
    console.error(error);
    return null;
  }
}