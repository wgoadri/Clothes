import { uploadImage } from "../storageService";
import { uploadBytes, getDownloadURL } from "firebase/storage";

// Mock the Firebase storage layer so no real network/SDK is touched.
jest.mock("firebase/storage", () => ({
  ref: jest.fn(() => ({ _isMockRef: true })),
  uploadBytes: jest.fn(() => Promise.resolve()),
  getDownloadURL: jest.fn(() => Promise.resolve("https://cdn/img.jpg")),
}));

jest.mock("../firebase", () => ({ storage: {} }));

describe("uploadImage", () => {
  it("returns remote URLs unchanged without uploading", async () => {
    const url = "https://example.com/a.jpg";
    await expect(uploadImage(url, "users/u1/x.jpg")).resolves.toBe(url);
  });

  it("returns falsy URIs unchanged", async () => {
    await expect(uploadImage(null, "users/u1/x.jpg")).resolves.toBeNull();
  });

  it("uploads a file:// URI via XHR->blob and returns the download URL", async () => {
    const fakeBlob = { close: jest.fn() };
    const fakeDownloadURL = "https://cdn/uploaded.jpg";

    // Stub getDownloadURL for this test
    getDownloadURL.mockResolvedValueOnce(fakeDownloadURL);

    // Mock XMLHttpRequest so that calling send() synchronously fires onload
    // with the fake blob as xhr.response (mirrors the RN XHR blob workaround).
    const xhrMock = {
      onload: null,
      onerror: null,
      responseType: "",
      response: fakeBlob,
      open: jest.fn(),
      send: jest.fn().mockImplementation(function () {
        // Trigger the onload callback synchronously
        if (this.onload) this.onload();
      }),
    };
    const XMLHttpRequestMock = jest.fn(() => xhrMock);
    global.XMLHttpRequest = XMLHttpRequestMock;

    const result = await uploadImage("file:///local/photo.jpg", "users/u1/photo.jpg");

    expect(uploadBytes).toHaveBeenCalledWith(
      expect.anything(),
      fakeBlob,
      { contentType: "image/jpeg" }
    );
    expect(getDownloadURL).toHaveBeenCalled();
    expect(result).toBe(fakeDownloadURL);
    // Blob resource should be released
    expect(fakeBlob.close).toHaveBeenCalled();
  });
});
