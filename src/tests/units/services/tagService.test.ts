import { getTagList } from "services/tagService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("getTagList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns tags when the request succeeds", async () => {
    const mockTags = [
      { tagId: 1, name: "New" },
      { tagId: 2, name: "Used" },
      { tagId: 3, name: "Vintage" },
    ];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockTags,
    });

    const result = await getTagList();

    expect(mockedApiClient.get).toHaveBeenCalledWith("/tag");
    expect(result).toEqual(mockTags);
  });

  test("returns empty array when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network error"));

    const result = await getTagList();

    expect(result).toEqual([]);
  });

  test("returns empty array when response data is not an array", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: { tagId: 1, name: "New" },
    });

    const result = await getTagList();

    expect(result).toEqual([]);
  });

  test("returns empty array on null response", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: null,
    });

    const result = await getTagList();

    expect(result).toEqual([]);
  });
});
