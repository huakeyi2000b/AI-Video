const WORKER_URL = "https://web001.gs1.indevs.in";
const UPLOAD_TOKEN = import.meta.env.VITE_UPLOAD_TOKEN || "zhonghua";

export async function uploadToOSS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("token", UPLOAD_TOKEN);

  const response = await fetch(WORKER_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json() as { success: boolean; url?: string; error?: string };

  if (!data.success || !data.url) {
    throw new Error(data.error || "上传失败");
  }

  return data.url;
}
