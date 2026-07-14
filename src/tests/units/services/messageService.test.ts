import { createRoom, postMessage, fetchRoom, fetchMessages, fetchUserRooms } from "services/messageService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const token = "fake-token";

describe("fetchRoom", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns the room when the request succeeds", async () => {
        const mockRoom = {
            id: 1,
            name: "Room test",
            sellerCip: "larj4236",
            buyerCip : "boum7113"
        };

        mockedApiClient.get.mockResolvedValue({
            status: 200,
            data: mockRoom,
        });

        const result = await fetchRoom("1", token);

        expect(result).toEqual(mockRoom);
    });
});

describe("fetchMessages", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns the room's messages when the request succeeds", async () => {
        const mockMessages = [{
            id: 1,
            content: "Message test 1",
            senderCip: "larj4236",
            senderFirstName : "JF",
            senderLastName : "Larouche",
            sentAt: "2026-06-22T12:00:00Z"
        }, {
            id: 2,
            content: "Message test 2",
            senderCip: "boum7113",
            senderFirstName : "Milo",
            senderLastName : "Boucher",
            sentAt: "2026-06-22T12:00:00Z"
        }];

        mockedApiClient.get.mockResolvedValue({
            status: 200,
            data: mockMessages,
        });

        const result = await fetchMessages("1", token);

        expect(result).toEqual(mockMessages);
    });
});

describe("fetchUserRooms", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns the user's rooms when the request succeeds", async () => {
        const mockRooms = [
        {
            id: 1,
            name: "Room test 1",
            sellerCip: "larj4236",
            buyerCip : "boum7113"
        }, {
            id: 2,
            name: "Room test 2",
            sellerCip: "larj4236",
            buyerCip : "boum7113"
        }];

        mockedApiClient.get.mockResolvedValue({
            status: 200,
            data: mockRooms,
        });

        const result = await fetchUserRooms(token);

        expect(result).toEqual(mockRooms);
    });
});

describe("createRoom", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns the created room when the request succeeds", async () => {
        const mockRoomPayload = {
            itemId : 1,
            buyerCip : "larj4236",
            token : token
        };

        const mockRoomResponse = {
            roomId : 1,
            itemId : 1,
            buyerCip : "larj4236",
            token : token
        };

        mockedApiClient.post.mockResolvedValue({
            status: 200,
            data: mockRoomResponse,
        });

        const result = await createRoom(mockRoomPayload);

        expect(result).toEqual(mockRoomResponse);
    });
})

describe("createRoom", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns the posted message when the request succeeds", async () => {
        const mockMessagePayload = {
            content : "Message de test",
            senderCip : "larj4236",
            roomId : "1",
            token : token
        };

        const mockMessageResponse = {
            content : "Message de test",
            senderCip : "larj4236",
            senderFirstName : "Jean-Félix",
            senderLastName : "Larouche",
            roomId : 1,
        };

        mockedApiClient.post.mockResolvedValue({
            status: 200,
            data: mockMessageResponse,
        });

        const result = await postMessage(mockMessagePayload);

        expect(result).toEqual(mockMessageResponse);
    });
})