import apiClient from "services/apiClient";
import { fetchReviewAverage, fetchReviewDetails, postReview } from "services/reviewService";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("fetchReviewAverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns average data when request succeeds", async () => {
    const mockData = { avgRating: 3.3, nbrReviews: 3 };
    mockedApiClient.get.mockResolvedValue({ data: mockData });

    const result = await fetchReviewAverage("pele3157");

    expect(apiClient.get).toHaveBeenCalledWith("/review/pele3157/average");
    expect(result).toEqual(mockData);
  });

  test("returns average of 0 when user has no reviews", async () => {
    const mockData = { avgRating: 0, nbrReviews: 0 };
    mockedApiClient.get.mockResolvedValue({ data: mockData });

    const result = await fetchReviewAverage("pele3157");

    expect(result).toEqual({ avgRating: 0, nbrReviews: 0 });
  });

  test("returns null when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network Error"));

    const result = await fetchReviewAverage("pele3157");

    expect(result).toBeNull();
  });

  test("returns null when cip is undefined", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network Error"));

    const result = await fetchReviewAverage(undefined);

    expect(result).toBeNull();
  });
});

describe("fetchReviewDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns list of reviews when request succeeds", async () => {
    const mockData = [
      {
        firstName: "Alex",
        lastName: "Larouche",
        profilPictureGuid: "abc123",
        content: "Excellent vendeur",
        timestamp: "2026-05-24T09:39:59.000Z",
        rating: 5,
      },
      {
        firstName: "Marie",
        lastName: "Tremblay",
        profilPictureGuid: null,
        content: "Rien à dire",
        timestamp: "2026-06-24T09:41:11.000Z",
        rating: 4,
      },
    ];
    mockedApiClient.get.mockResolvedValue({ data: mockData });

    const result = await fetchReviewDetails("pele3157");

    expect(apiClient.get).toHaveBeenCalledWith("/review/pele3157/details");
    expect(result).toEqual(mockData);
    expect(result).toHaveLength(2);
  });

  test("returns empty list when user has no reviews", async () => {
    mockedApiClient.get.mockResolvedValue({ data: [] });

    const result = await fetchReviewDetails("pele3157");

    expect(result).toEqual([]);
  });

  test("returns null when request fails", async () => {
    mockedApiClient.get.mockRejectedValue(new Error("Network Error"));

    const result = await fetchReviewDetails("pele3157");

    expect(result).toBeNull();
  });
});

describe("postReview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 when request succeeds", async () => {
    mockedApiClient.post.mockResolvedValue({ data: {} });

    const result = await postReview("pele3157", "Super vendeur", 5, "mock-token");

    expect(apiClient.post).toHaveBeenCalledWith("/review/pele3157",
      { content: "Super vendeur", rating: 5 },
      { headers: { Authorization: "Bearer mock-token" } }
    );
    expect(result).toBe(200);
  });

  test("returns 403 when user has no conversation with seller", async () => {
    mockedApiClient.post.mockRejectedValue({ response: { status: 403 } });

    const result = await postReview("pele3157", "Super vendeur", 5, "mock-token");

    expect(result).toBe(403);
  });

  test("returns 500 when request fails with unknown error", async () => {
    mockedApiClient.post.mockRejectedValue(new Error("Network Error"));

    const result = await postReview("pele3157", "Super vendeur", 5, "mock-token");

    expect(result).toBe(500);
  });

  test("returns 500 when cip is undefined", async () => {
    mockedApiClient.post.mockRejectedValue(new Error("Network Error"));

    const result = await postReview(undefined, "Super vendeur", 5, "mock-token");

    expect(result).toBe(500);
  });
});