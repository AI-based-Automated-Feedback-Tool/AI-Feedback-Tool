// src/Components/StudentsComponents/Feedback/uploadImageService.js
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Upload an image file to backend.
 * @param {File} file
 * @param {string[]} allowedFormats
 * @returns {Promise<{url:string, mime:string, size:number}>}
 */
export async function uploadImage(file, allowedFormats = []) {
  const form = new FormData();
  form.append("image", file);

  const allowed = allowedFormats.join(",");
  const res = await fetch(`${API}/api/uploads/image?allowed=${allowed}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let msg = "Upload failed";
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}
