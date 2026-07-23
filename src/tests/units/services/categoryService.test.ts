import { getCategoryList } from "services/categoryService";
import apiClient from "services/apiClient";
import { fetchCategoryList, createCategory } from "services/categoryService";

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

    expect(mockedApiClient.get).toHaveBeenCalledWith("/category");
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

describe("fetchCategoryList", () => {
  test("retourne les catégories", async () => {
    apiClient.get = jest.fn().mockResolvedValue({
      status: 200,
      data: [{ categoryId: 1, name: "Catégorie", parentCategory: null }],
    });

    const result = await fetchCategoryList({
      token: "token",
      logout: jest.fn(),
    });

    expect(result).toHaveLength(1);
  });

  test("retourne null si une erreur survient", async () => {
    apiClient.get = jest.fn().mockRejectedValue(new Error());

    const result = await fetchCategoryList({
      token: "token",
      logout: jest.fn(),
    });

    expect(result).toBeNull();
  });
});

describe("createCategory", () => {
  test("retourne true lorsque la création réussit", async () => {
    apiClient.post = jest.fn().mockResolvedValue({
      status: 201,
    });

    const result = await createCategory(
      {
        token: "token",
        logout: jest.fn(),
      },
      {
        name: "Test",
        parentCategory: null,
      }
    );

    expect(result).toBe(true);
  });
});

