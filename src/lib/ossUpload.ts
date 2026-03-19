const WORKER_URL = "https://web001.gs1.indevs.in";

export async function uploadToOSS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

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
