import { useState, useCallback } from "react";

interface GenerationResult {
  type: "video" | "image";
  url: string;
  prompt: string;
  timestamp: number;
}

interface UseVideoGeneratorOptions {
  apiKey: string;
}

export function useVideoGenerator({ apiKey }: UseVideoGeneratorOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRequestTime, setLastRequestTime] = useState(() => {
    const saved = localStorage.getItem('lastVideoRequest');
    return saved ? parseInt(saved) : 0;
  });

  const generate = useCallback(
    async ({
      prompt,
      aspectRatio,
      images,
      mode,
      isImage = false,
      imageModel,
    }: {
      prompt: string;
      aspectRatio: string;
      images?: string[];
      mode?: string;
      isImage?: boolean;
      imageModel?: string;
    }) => {
      if (!apiKey) {
        setError("请先设置 API Key");
        return;
      }

      if (!prompt || prompt.trim() === "") {
        setError("请输入视频描述");
        return;
      }

      // 检查是否距离上次请求不足 60 秒
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      const minInterval = 60000; // 60 秒

      if (lastRequestTime > 0 && timeSinceLastRequest < minInterval) {
        const waitTime = Math.ceil((minInterval - timeSinceLastRequest) / 1000);
        setError(`请等待 ${waitTime} 秒后再试（API 限制：1分钟只能请求1次）`);
        return;
      }

      setIsGenerating(true);
      setError(null);
      setProgress("正在连接服务器...");
      setResult(null);
      setLastRequestTime(now);
      localStorage.setItem('lastVideoRequest', now.toString());

      try {
        // 构建 API 请求体
        const body: Record<string, unknown> = {
          model: isImage ? (imageModel || "flux-2-pro") : "grok-imagine-video",
          prompt: prompt.trim(),
          n: 1,
          size: "1024x1024",
          response_format: "url",
          sse: true,
        };

        if (isImage) {
          // 图片生成模式
          
          // imagen-3 和 plutogen-o1 只支持基础参数
          if (imageModel !== "imagen-3" && imageModel !== "plutogen-o1") {
            body.aspectRatio = aspectRatio || "1:1";
            body.resolution = "1k";
          }
          
          // 参考图支持（只有 Flux 模型支持）
          if (imageModel && imageModel.startsWith("flux-") && images && images.length > 0) {
            body.image_urls = images;
          }
        } else {
          // 视频生成模式
          if (mode) {
            body.mode = mode;
          }
          
          body.aspectRatio = aspectRatio || "3:2";
          
          // 图生视频的参考图
          if (images && images.length > 0) {
            body.image_urls = images;
          }
        }

        console.log("=== 发送请求 ===");
        console.log("Prompt:", prompt.trim());
        console.log("AspectRatio 参数:", aspectRatio);
        console.log("Images:", images?.length || 0, "张");
        console.log("Mode:", mode || "无");
        console.log("IsImage:", isImage);
        console.log("ImageModel:", imageModel || "无");
        console.log("完整 Request body:", JSON.stringify(body, null, 2));

        // 直接调用 API
        const response = await fetch(
          "https://api.airforce/v1/images/generations",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        console.log("响应状态:", response.status, response.statusText);

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`请求失败 (${response.status}): ${errText}`);
        }

        // Handle SSE streaming
        const reader = response.body?.getReader();
        if (!reader) throw new Error("无法读取响应流");

        const decoder = new TextDecoder();
        let buffer = "";
        let finalUrl = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("=== SSE 流结束 ===");
            console.log("最终 URL:", finalUrl);
            console.log("剩余 buffer:", buffer);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          console.log(`收到 ${lines.length} 行数据`);

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]" || jsonStr === ": keepalive") continue;

            console.log("收到 SSE 数据:", jsonStr);

            try {
              const parsed = JSON.parse(jsonStr);
              console.log("解析后的数据:", parsed);
              
              // 如果是 Provider error，记录但不立即失败
              if (parsed.error) {
                console.warn("收到错误消息:", parsed.error);
                // 不要立即抛出错误，继续等待可能的成功响应
                if (!parsed.error.includes("Provider error")) {
                  throw new Error(parsed.error);
                }
                // Provider error 只是警告，继续等待
                continue;
              }
              
              if (parsed.data?.[0]?.url) {
                finalUrl = parsed.data[0].url;
                console.log("✅ 获取到视频 URL:", finalUrl);
              }
              if (parsed.progress) {
                setProgress(`生成中... ${parsed.progress}%`);
              }
            } catch (e) {
              if (e instanceof SyntaxError) {
                // partial JSON, ignore
                console.log("JSON 解析失败（可能是部分数据）");
              } else {
                throw e;
              }
            }
          }
        }

        // Also try non-streaming parse
        if (!finalUrl && buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer);
            if (parsed.data?.[0]?.url) {
              finalUrl = parsed.data[0].url;
            }
          } catch {
            // ignore
          }
        }

        if (finalUrl) {
          setResult({
            type: isImage ? "image" : "video",
            url: finalUrl,
            prompt,
            timestamp: Date.now(),
          });
          setProgress("生成完成！");
        } else {
          throw new Error("未能获取生成结果");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知错误");
        setProgress("");
      } finally {
        setIsGenerating(false);
      }
    },
    [apiKey]
  );

  return { generate, isGenerating, progress, result, error, setError, lastRequestTime };
}
