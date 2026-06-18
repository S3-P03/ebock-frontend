export interface Message {
    roomId: number;
    content: string;
    senderCip: string;
    senderFirstName: string;
    senderLastName: string;
    sentAt: Date;
}

export interface MessageRaw {
    roomId: number;
    content: string;
    senderCip: string;
    senderFirstName: string;
    senderLastName: string;
    sentAt: string;
}

export interface Room {
    roomId: number;
    itemId: number;
    itemName: string;
    sellerCip: string;
    sellerFirstName: string;
    sellerLastName: string;
    buyerCip: string;
    buyerFirstName: string;
    buyerLastName: string;

}

export interface RoomPayload {
  itemId: number;
  buyerCip: string;
}

export interface MessagePayload {
    content: string;
    senderCip: string;
}