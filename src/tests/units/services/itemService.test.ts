import { fetchUserItems, fetchItem, fetchItemImages, getFilteredItems, FilterParams, addItem, updateItem, banItem } from "services/itemService";
import apiClient, { emitApiError } from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockedEmitApiError = emitApiError as jest.MockedFunction<typeof emitApiError>;

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

describe("addItem", () => {

  const token = "fake-token";
  const mockPayload = {
    name: "item.name",
    description: "item.description",
    price: 15,
    quantity: 1,
    categoryId: 1,
    wearId: 1,
    tagList: [2],
    deliveryOptionList: [2,3],
    paymentOptionList: [2],
    imageList: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns itemId when the request succeeds", async () => {
    

    mockedApiClient.post.mockResolvedValue({
      status: 200,
      data: {itemId: 1},
    });

    const result = await addItem(mockPayload, token);

    expect(result).toEqual({itemId: 1});
  });

  test("returns null when status is 401", async () => {
      mockedApiClient.post.mockResolvedValue({
        status: 401,
        data: null,
      });
  
      const result = await addItem(mockPayload, token );
  
      expect(result).toBeNull();
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

    const result = await getFilteredItems(true, fakeToken, 1, filters);

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

    await getFilteredItems(true, fakeToken, 2, filters);

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

    await getFilteredItems(true, fakeToken, 1, filters);

    expect(mockedApiClient.get).toHaveBeenCalledWith("/item/list/1",  {"headers": {"Authorization": `Bearer ${fakeToken}`}});
  });

  test("returns empty array when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network error"));

    const filters: FilterParams = { minP: 50 };

    const result = await getFilteredItems(true, fakeToken, 1, filters);

    expect(result).toEqual([]);
  });

  test("returns empty array when response data is not an array", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: { id: 1, name: "Item 1" },
    });
    
    const fakeToken = "token123";
    const filters: FilterParams = {};

    const result = await getFilteredItems(true, fakeToken, 1, filters);

    expect(result).toEqual([]);
  });

  test("returns empty array on null response", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: null,
    });

    const filters: FilterParams = {};

    const result = await getFilteredItems(true, fakeToken, 1, filters);

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

    await getFilteredItems(true, fakeToken, 1, filters);

    const callArg = (mockedApiClient.get as jest.Mock).mock.calls[0][0];
    expect(callArg).toContain("categories=1%2C2%2C3");
    expect(callArg).toContain("tags=5%2C6");
    expect(callArg).toContain("wears=1%2C2");
  });
});

describe("updateItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls the correct URL with correct headers", async () => {
    mockedApiClient.put.mockResolvedValue({
      status: 200,
      data: {},
    });

    await updateItem(42, fakeToken, { price: 20 });

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      "/item/42",
      { price: 20 },
      { headers: { Authorization: `Bearer ${fakeToken}` } }
    );
  });

  test("emits a 400 error message when the API responds with status 400", async () => {
    mockedApiClient.put.mockRejectedValue({ status: 400 });

    await updateItem(42, fakeToken, { price: 20 });

    expect(mockedEmitApiError).toHaveBeenCalledWith(
      "Erreur lors de la mise à jour de l'article, veuillez vérifier les données fournies",
      400
    );
  });

  test("emits a 403 error message when the API responds with status 403", async () => {
    mockedApiClient.put.mockRejectedValue({ status: 403 });

    await updateItem(42, fakeToken, { price: 20 });

    expect(mockedEmitApiError).toHaveBeenCalledWith(
      "Erreur lors de la mise à jour de l'article, ce n'est pas votre article",
      403
    );
  });

  test("emits a 404 error message when the API responds with status 404", async () => {
    mockedApiClient.put.mockRejectedValue({ status: 404 });

    await updateItem(42, fakeToken, { price: 20 });

    expect(mockedEmitApiError).toHaveBeenCalledWith(
      "Erreur lors de la mise à jour de l'article, l'article n'existe pas",
      404
    );
  });

  test("emits a generic error message for unknown statuses", async () => {
    mockedApiClient.put.mockRejectedValue({ status: 500 });

    await updateItem(42, fakeToken, { price: 20 });

    expect(mockedEmitApiError).toHaveBeenCalledWith(
      "Erreur lors de la mise à jour de l'article",
      500
    );
  });
});

describe("banItem", () => {
    const mockToken = "fake-jwt-token";
    const mockLogout = jest.fn();
    const mockItemId = "123";
 
    const fetchOptions = {
        token: mockToken,
        logout: mockLogout,
    };
 
    beforeEach(() => {
        jest.clearAllMocks();
    });
 
    test("returns true and sends correct headers when the request succeeds", async () => {
        mockedApiClient.delete.mockResolvedValue({ status: 200 });
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(mockedApiClient.delete).toHaveBeenCalledWith(`/item/${mockItemId}`, {
            headers: { Authorization: `Bearer ${mockToken}` },
        });
        expect(result).toBe(true);
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockedEmitApiError).not.toHaveBeenCalled();
    });
 
    test("bloque l'exécution et ne fait aucun appel réseau si itemId est manquant", async () => {
        // Ensures the service protects the backend from empty ID strings
        const result = await banItem(fetchOptions, "");
 
        expect(mockedApiClient.delete).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
 
    test("returns false and calls logout on 401 Unauthorized", async () => {
        mockedApiClient.delete.mockRejectedValue({ response: { status: 401 } });
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(result).toBe(false);
        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockedEmitApiError).not.toHaveBeenCalled();
    });
 
    test("returns false and emits 403 error on Forbidden", async () => {
        mockedApiClient.delete.mockRejectedValue({ response: { status: 403 } });
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(result).toBe(false);
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockedEmitApiError).toHaveBeenCalledWith(
            "Vous n'avez pas les autorisations pour bannir cet item.",
            403
        );
    });
 
    test("returns false and emits error with status code on generic API failure", async () => {
        mockedApiClient.delete.mockRejectedValue({ response: { status: 404 } });
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(result).toBe(false);
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockedEmitApiError).toHaveBeenCalledWith(
            "Erreur lors du bannissement de l'item.",
            404
        );
    });
 
    test("returns false and emits 500 on network error without response status", async () => {
        mockedApiClient.delete.mockRejectedValue(new Error("Network timeout"));
 
        const result = await banItem(fetchOptions, mockItemId);
 
        expect(result).toBe(false);
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockedEmitApiError).toHaveBeenCalledWith(
            "Erreur lors du bannissement de l'item.",
            500
        );
    });
});