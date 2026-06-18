import { fetchUserItems, fetchItem, fetchItemImages } from "../../../services/itemService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

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

  test("returns null when parsing data throws", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      get data() {
        throw new Error("Bad data");
      },
    });
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

  test("returns null when parsing data throws", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      get data() {
        throw new Error("Bad data");
      },
    });
  });
});