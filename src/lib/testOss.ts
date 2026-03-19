// 临时测试文件，测完可删
export async function testOssCors() {
  const endpoint = import.meta.env.VITE_OSS_ENDPOINT as string;
  const bucket = import.meta.env.VITE_OSS_BUCKET as string;
  const url = `${endpoint}/${bucket}/`;

  try {
    const res = await fetch(url, {
      method: "OPTIONS",
      headers: {
        "Origin": window.location.origin,
        "Access-Control-Request-Method": "PUT",
        "Access-Control-Request-Headers": "authorization,content-type,x-amz-date,x-amz-content-sha256",
      },
    });
    console.log("OPTIONS 状态:", res.status);
    console.log("CORS 头:", {
      "allow-origin": res.headers.get("access-control-allow-origin"),
      "allow-methods": res.headers.get("access-control-allow-methods"),
      "allow-headers": res.headers.get("access-control-allow-headers"),
    });
    return res.status;
  } catch (e) {
    console.error("CORS 测试失败:", e);
    return null;
  }
}
