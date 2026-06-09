import { uploadImage } from "../storageService";

// Mock the Firebase storage layer so no real network/SDK is touched.
jest.mock("firebase/storage", () => ({
  ref: jest.fn(() => ({})),
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
});
