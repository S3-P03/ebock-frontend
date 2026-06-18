import { fetchImage } from "../../../services/imageService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("fetchImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => "blob:fake-url");
});

  it("returns the blob URL", async () => {
    const mockBlob = new Blob(["image data"], { type: "image/png" });

    mockedApiClient.get.mockResolvedValue({
      data: mockBlob,
    });

    const createObjectURLSpy = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:http://localhost/fake-image");

    const result = await fetchImage("1234-abcd-1234-abcd");

    expect(apiClient.get).toHaveBeenCalledWith("/image/1234-abcd-1234-abcd", {
      responseType: "blob",
    });

    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
    expect(result).toBe("blob:http://localhost/fake-image");
  });

  it("returns null when createObjectURL throws", async () => {
    const mockBlob = new Blob(["image data"]);

    mockedApiClient.get.mockResolvedValue({
      data: mockBlob,
    });

    jest.spyOn(URL, "createObjectURL").mockImplementation(() => {
      throw new Error("Failed");
    });
  });
});