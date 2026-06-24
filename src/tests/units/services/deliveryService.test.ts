import { getDeliveryList } from "services/deliveryOptionService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("getDeliveryList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns deliveries when the request succeeds", async () => {
    const mockDeliveries = [
      { deliveryId: 1, name: "Pickup" },
      { deliveryId: 2, name: "Shipping" },
      { deliveryId: 3, name: "Local Delivery" },
    ];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockDeliveries,
    });

    const result = await getDeliveryList();

    expect(mockedApiClient.get).toHaveBeenCalledWith("/deliveryOption/list");
    expect(result).toEqual(mockDeliveries);
  });

  test("returns empty array when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network error"));

    const result = await getDeliveryList();

    expect(result).toEqual([]);
  });

  test("returns empty array when response data is not an array", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: { deliveryId: 1, name: "Pickup" },
    });

    const result = await getDeliveryList();

    expect(result).toEqual([]);
  });

  test("returns empty array on null response", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: null,
    });

    const result = await getDeliveryList();

    expect(result).toEqual([]);
  });
});
