import { getCategoryList } from "services/categoryService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("getCategoryList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns categories when the request succeeds", async () => {
    const mockCategories = [
      { categoryId: 1, name: "Electronics" },
      { categoryId: 2, name: "Clothing" },
      { categoryId: 3, name: "Books" },
    ];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockCategories,
    });

    const result = await getCategoryList();

    expect(mockedApiClient.get).toHaveBeenCalledWith("/category/list");
    expect(result).toEqual(mockCategories);
  });

  test("returns empty array when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network error"));

    const result = await getCategoryList();

    expect(result).toEqual([]);
  });

  test("returns empty array when response data is not an array", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: { categoryId: 1, name: "Electronics" },
    });

    const result = await getCategoryList();

    expect(result).toEqual([]);
  });

  test("returns empty array on null response", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: null,
    });

    const result = await getCategoryList();

    expect(result).toEqual([]);
  });
});
