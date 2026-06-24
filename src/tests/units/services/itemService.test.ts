import { fetchUserItems, fetchItem, fetchItemImages, getFilteredItems, FilterParams } from "services/itemService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const fakeToken = "token123";

describe("fetchItem", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the item when the request succeeds", async () => {
    const mockItem = {
      id: 1,
      name: "Item test",
    };

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockItem,
    });

    const result = await fetchItem("1");

    expect(result).toEqual(mockItem);
  });

  test("returns null when parsing data throws", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      get data() {
        throw new Error("Bad data");
      },
    });
  });
});

describe("fetchUserItems", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns items when the request succeeds", async () => {
    const mockItems = [{
      id: 1,
      name: "Item test 1",
    }, {
      id: 2,
      name: "Item test 2"
    }];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockItems,
    });

    const result = await fetchUserItems("larj4236");

    expect(result).toEqual(mockItems);
  });
});

describe("fetchItemImages", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns images", async () => {
    const mockImages = [{
      id: 1,
      guid: "1234-abcd-1234-abcd",
    }, {
      id: 2,
      guid: "abcd-1234-efgh-5678",
    }];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockImages,
    });

    const result = await fetchItemImages("1");

    expect(result).toEqual(mockImages);
  });
});

describe("getFilteredItems", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns filtered items when the request succeeds", async () => {
    const mockItems = [
      { id: 1, name: "Item 1", price: 50 },
      { id: 2, name: "Item 2", price: 75 },
    ];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockItems,
    });

    const filters: FilterParams = {
      minP: 40,
      maxP: 100,
      categories: [1, 2],
    };

    const result = await getFilteredItems(fakeToken, 1, filters);

    expect(mockedApiClient.get).toHaveBeenCalledWith(
      "/item/list/1?minP=40&maxP=100&categories=1%2C2",
      { headers: { Authorization: `Bearer ${fakeToken}` } }
    );
    expect(result).toEqual(mockItems);
  });

  test("returns items with all filter parameters", async () => {
    const mockItems = [{ id: 1, name: "Item 1" }];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockItems,
    });

    const filters: FilterParams = {
      minP: 20,
      maxP: 150,
      maxD: 50,
      fav: true,
      categories: [1],
      tags: [2, 3],
      wears: [1],
      deliveries: [2],
      payments: [1, 3],
    };

    await getFilteredItems(fakeToken, 2, filters);

    expect(mockedApiClient.get).toHaveBeenCalled();
    const callArg = (mockedApiClient.get as jest.Mock).mock.calls[0][0];
    expect(callArg).toContain("/item/list/2");
    expect(callArg).toContain("minP=20");
    expect(callArg).toContain("maxP=150");
    expect(callArg).toContain("maxD=50");
    expect(callArg).toContain("fav=true");
  });

  test("returns items without optional filters", async () => {
    const mockItems = [{ id: 1, name: "Item 1" }];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockItems,
    });

    const filters: FilterParams = {};

    await getFilteredItems(fakeToken, 1, filters);

    expect(mockedApiClient.get).toHaveBeenCalledWith("/item/list/1",  {"headers": {"Authorization": `Bearer ${fakeToken}`}});
  });

  test("returns empty array when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network error"));

    const filters: FilterParams = { minP: 50 };

    const result = await getFilteredItems(fakeToken, 1, filters);

    expect(result).toEqual([]);
  });

  test("returns empty array when response data is not an array", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: { id: 1, name: "Item 1" },
    });
    
    const fakeToken = "token123";
    const filters: FilterParams = {};

    const result = await getFilteredItems(fakeToken, 1, filters);

    expect(result).toEqual([]);
  });

  test("returns empty array on null response", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: null,
    });

    const filters: FilterParams = {};

    const result = await getFilteredItems(fakeToken, 1, filters);

    expect(result).toEqual([]);
  });

  test("correctly handles array filters with multiple values", async () => {
    const mockItems = [{ id: 1, name: "Item 1" }];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockItems,
    });

    const filters: FilterParams = {
      categories: [1, 2, 3],
      tags: [5, 6],
      wears: [1, 2],
    };

    await getFilteredItems(fakeToken, 1, filters);

    const callArg = (mockedApiClient.get as jest.Mock).mock.calls[0][0];
    expect(callArg).toContain("categories=1%2C2%2C3");
    expect(callArg).toContain("tags=5%2C6");
    expect(callArg).toContain("wears=1%2C2");
  });
});