import { getPaymentList } from "services/paymentOptionService";
import apiClient from "services/apiClient";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("getPaymentList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns payments when the request succeeds", async () => {
    const mockPayments = [
      { paymentId: 1, name: "Cash" },
      { paymentId: 2, name: "Debit Card" },
      { paymentId: 3, name: "Credit Card" },
      { paymentId: 4, name: "E-Transfer" },
    ];

    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: mockPayments,
    });

    const result = await getPaymentList();

    expect(mockedApiClient.get).toHaveBeenCalledWith("/paymentOption/list");
    expect(result).toEqual(mockPayments);
  });

  test("returns empty array when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network error"));

    const result = await getPaymentList();

    expect(result).toEqual([]);
  });

  test("returns empty array when response data is not an array", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: { paymentId: 1, name: "Cash" },
    });

    const result = await getPaymentList();

    expect(result).toEqual([]);
  });

  test("returns empty array on null response", async () => {
    mockedApiClient.get.mockResolvedValue({
      status: 200,
      data: null,
    });

    const result = await getPaymentList();

    expect(result).toEqual([]);
  });
});
