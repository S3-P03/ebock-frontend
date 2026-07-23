import apiClient from "services/apiClient";
import { fetchComments, postComment, deleteComment } from "services/commentService";

jest.mock("services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("fetchComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns list of comments when request succeeds", async () => {
    const mockData = [
      {
        firstName: "Jean-Félix",
        lastName: "Larouche",
        content: "Cet article est-il toujours disponible ?",
        idParentComment: null,
        idComment: 1,
        timestamp: "2026-07-09 13:17:37.959103",
        profilePictureUrl: null
      },
    ];
    mockedApiClient.get.mockResolvedValue({ data: mockData });

    const result = await fetchComments("1");

    expect(apiClient.get).toHaveBeenCalledWith("/item/1/comment");
    expect(result).toEqual(mockData);
  });

  test("returns empty list when no comments", async () => {
    mockedApiClient.get.mockResolvedValue({ data: [] });

    const result = await fetchComments("1");

    expect(result).toEqual([]);
  });

  test("returns null when request fails", async () => {
    mockedApiClient.get.mockRejectedValue({ response: { status: 404 } });

    const result = await fetchComments("1");

    expect(result).toBeNull();
  });
});

describe("postComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 when request succeeds", async () => {
    mockedApiClient.post.mockResolvedValue({ data: {}, status: 201 });

    const result = await postComment("1", "Super article !", null, "mock-token");

    expect(apiClient.post).toHaveBeenCalledWith(
        "/item/1/comment",
        { content: "Super article !", idParent: null },
        { headers: { Authorization: "Bearer mock-token" } }
    );
    expect(result).toBe(201);
  });

  test("returns 200 when posting a reply", async () => {
    mockedApiClient.post.mockResolvedValue({ data: {}, status: 201 });

    const result = await postComment("1", "Oui !", 3, "mock-token");

    expect(apiClient.post).toHaveBeenCalledWith(
        "/item/1/comment",
        { content: "Oui !", idParent: 3 },
        { headers: { Authorization: "Bearer mock-token" } }
    );
    expect(result).toBe(201);
  });

  test("returns 500 when request fails", async () => {
    mockedApiClient.post.mockRejectedValue(new Error("Network Error"));

    const result = await postComment("1", "Super article !", null, "mock-token");

    expect(result).toBe(500);
  });
});

describe("deleteComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 when request succeeds", async () => {
    mockedApiClient.delete.mockResolvedValue({ data: {}, status: 200 });

    const result = await deleteComment(1, "mock-token");

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/comment/1",
      { headers: { Authorization: "Bearer mock-token" } }
    );
    expect(result).toBe(200);
  });

  test("returns 500 when request fails", async () => {
    mockedApiClient.delete.mockRejectedValue(new Error("Network Error"));

    const result = await deleteComment(1, "mock-token");

    expect(result).toBe(500);
  });
});