import { apiFetch } from "../../../lib/http-client";

type PresignResponse = { upload_url: string; file_url: string };
export type UploadItem = { file: File; kind: string };

// Xin presigned URL từ BE (JSON, có auth).
async function requestPresign(
  file: File,
  kind: string,
): Promise<PresignResponse> {
  return apiFetch<PresignResponse>("/api/v1/uploads/presign", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      filename: file.name,
      content_type: file.type,
      kind,
    }),
  });
}

async function uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Tải ảnh lên thất bại (${res.status}).`);
}

// Xử lý 1 file: presign theo kind -> PUT lên S3 -> trả path_url.
export async function uploadImage(file: File, kind: string): Promise<string> {
  const { upload_url, file_url } = await requestPresign(file, kind);
  await uploadFileToS3(upload_url, file);
  return file_url;
}

// Nhiều file upload song song, trả về danh sách path_url theo đúng thứ tự input.
export async function uploadImages(items: UploadItem[]): Promise<string[]> {
  const uploadTasks = items.map((item) => uploadImage(item.file, item.kind));
  const pathUrls = await Promise.all(uploadTasks);
  return pathUrls;
}

// Lấy presigned GET URL để XEM ảnh (bucket private). Truyền path_url đã lưu.
export async function getViewUrl(pathUrl: string): Promise<string> {
  const { url } = await apiFetch<{ url: string }>("/api/v1/uploads/view-url", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ path_url: pathUrl }),
  });
  return url;
}
