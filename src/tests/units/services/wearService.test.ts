import { getWearList } from "services/wearService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("getWearList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns wears when the request succeeds", async () => {
    const mockWears = [
      { wearId: 1, name: "Like New" },
      { wearId: 2, name: "Good" },
      { wearId: 3, name: "Fair" },
      { wearId: 4, name: "Poor" },
    ];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockWears,
    });

    const result = await getWearList();

    expect(mockedApiClient.get).toHaveBeenCalledWith("/wear/list");
    expect(result).toEqual(mockWears);
  });

  test("returns empty array when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network error"));

    const result = await getWearList();

    expect(result).toEqual([]);
  });

  test("returns empty array when response data is not an array", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: { wearId: 1, name: "Like New" },
    });

    const result = await getWearList();

    expect(result).toEqual([]);
  });

  test("returns empty array on null response", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: null,
    });

    const result = await getWearList();

    expect(result).toEqual([]);
  });
});
