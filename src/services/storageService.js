// storageService.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Read a local file URI into a Blob.
 *
 * On React Native, `fetch(uri).blob()` produces a Blob the Firebase JS SDK
 * cannot read, surfacing as `storage/unknown`. The XHR approach below is the
 * documented workaround and yields a Blob `uploadBytes` accepts.
 */
const uriToBlob = (uri) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error("Failed to read image file"));
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

/**
 * Upload a local image URI to Firebase Storage and return its download URL.
 *
 * - Remote URIs (http/https) and empty values are returned unchanged.
 * - `path` MUST live under `users/{userId}/...` to satisfy storage.rules.
 *
 * Throws on failure so callers can decide whether to fall back to the local URI.
 */
export const uploadImage = async (uri, path) => {
  if (!uri || !uri.startsWith("file://")) return uri;

  const blob = await uriToBlob(uri);
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
    return await getDownloadURL(storageRef);
  } finally {
    // Free the underlying native blob resource (RN-specific helper).
    blob.close?.();
  }
};
