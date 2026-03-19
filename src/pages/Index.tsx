import { useState, useEffect } from "react";
import { Sparkles, Video, ImagePlus, Loader2, AlertCircle } from "lucide-react";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { AspectRatioSelector } from "@/components/AspectRatioSelector";
import { ModeSelector } from "@/components/ModeSelector";
import { ImageModelSelector } from "@/components/ImageModelSelector";
import { ImageAspectRatioSelector } from "@/components/ImageAspectRatioSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultDisplay } from "@/components/ResultDisplay";
import { useVideoGenerator } from "@/hooks/useVideoGenerator";

type Mode = "text" | "image" | "text-to-image";

const Index = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("vg_api_key") || "");
  const [mode, setMode] = useState<Mode>("text");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("3:2");
  const [generationMode, setGenerationMode] = useState("normal");
  const [imageModel, setImageModel] = useState("flux-2-pro");
  const [imageAspectRatio, setImageAspectRatio] = useState("1:1");
  const [images, setImages] = useState<string[]>([]);
  const [generationStartTime, setGenerationStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("vg_api_key", key);
  };

  // 优先使用用户输入的 API Keys，否则使用环境变量
  const envApiKeys = import.meta.env.VITE_API_KEYS || "";
  const userApiKeys = apiKey;
  const allApiKeys = userApiKeys || envApiKeys;
  
  // 解析多个 API Key（支持逗号或换行分隔）
  const apiKeys = allApiKeys.split(/[,\n]/).map(k => k.trim()).filter(k => k.length > 0);
  
  // 根据时间戳轮换选择 API Key
  const keyIndex = apiKeys.length > 0 ? Math.floor(Date.now() / 60000) % apiKeys.length : 0;
  const currentApiKey = apiKeys.length > 0 ? apiKeys[keyIndex] : "";
  
  // 显示当前 Key 的后 4 位（用于调试）
  const keyPreview = currentApiKey ? `...${currentApiKey.slice(-4)}` : "无";
  console.log(`当前使用第 ${keyIndex + 1} 个 API Key (${keyPreview})，共 ${apiKeys.length} 个`);

  const { generate, isGenerating, progress, result, error, lastRequestTime } = useVideoGenerator({ apiKey: currentApiKey });

  const [countdown, setCountdown] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);

  // 计算生成持续时间
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating && generationStartTime > 0) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - generationStartTime) / 1000));
      }, 1000);
    } else if (!isGenerating) {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating, generationStartTime]);

  // 计算倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastRequestTime > 0) {
        const elapsed = Date.now() - lastRequestTime;
        const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));
        setCountdown(remaining);
        
        // 延迟 2 秒后显示倒计时提示
        if (remaining > 0 && elapsed >= 2000) {
          setShowCountdown(true);
        } else if (remaining === 0) {
          setShowCountdown(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRequestTime]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerationStartTime(Date.now());
    generate({
      prompt: prompt.trim(),
      aspectRatio: mode === "text-to-image" ? imageAspectRatio : aspectRatio,
      images: mode === "image" || (mode === "text-to-image" && images.length > 0) ? images : undefined,
      mode: mode !== "text-to-image" ? generationMode : undefined,
      isImage: mode === "text-to-image",
      imageModel: mode === "text-to-image" ? imageModel : undefined,
    });
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">AI Video</span>
              <span className="text-foreground/60 font-light ml-2">Generator</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              文字生成视频 · 图片生成视频
            </p>
          </div>
          <ApiKeyDialog apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
        </header>

        {/* Main content - Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Form */}
          <div className="space-y-8">
            {/* Mode Toggle */}
            <div className="glass-card p-1.5 flex gap-1">
              <button
                onClick={() => setMode("text")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === "text"
                    ? "bg-primary text-primary-foreground neon-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Video className="w-4 h-4" />
                文生视频
              </button>
              <button
                onClick={() => setMode("image")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === "image"
                    ? "bg-primary text-primary-foreground neon-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <ImagePlus className="w-4 h-4" />
                图生视频
              </button>
              <button
                onClick={() => setMode("text-to-image")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === "text-to-image"
                    ? "bg-primary text-primary-foreground neon-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                文生图
              </button>
            </div>

            {/* Main form */}
            <div className="glass-card neon-border p-6 space-y-6">
              {/* Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground/80">
                    {mode === "text" ? "描述你想要的视频" : mode === "image" ? "描述视频动效" : "描述你想要的图片"}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {prompt.length} 字
                    </span>
                    {prompt && (
                      <>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(prompt);
                          }}
                          className="p-1 rounded hover:bg-secondary/50 transition-colors"
                          title="复制"
                        >
                          <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setPrompt("")}
                          className="p-1 rounded hover:bg-destructive/20 transition-colors"
                          title="清空"
                        >
                          <svg className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      mode === "text"
                        ? "例如：一只金色的凤凰在星空中展翅飞翔，火焰尾巴划过银河..."
                        : mode === "image"
                        ? "例如：让图片中的人物缓慢转头微笑..."
                        : "例如：一只可爱的小猫坐在窗台上，阳光洒在它的毛发上..."
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-secondary/30 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 resize-none transition-all"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <button
                      onClick={async () => {
                        const text = await navigator.clipboard.readText();
                        setPrompt(text);
                      }}
                      className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      title="粘贴"
                    >
                      <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const textarea = document.querySelector('textarea');
                        textarea?.select();
                      }}
                      className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      title="全选"
                    >
                      <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Image upload for image mode */}
              {mode === "image" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    参考图片（最多 2 张）
                  </label>
                  <ImageUploader images={images} onImagesChange={setImages} maxImages={2} />
                </div>
              )}

              {/* Image upload for text-to-image mode with flux models */}
              {mode === "text-to-image" && (imageModel === "flux-2-pro" || imageModel === "flux-2-dev" || imageModel === "flux-2-klein-4b" || imageModel === "flux-2-klein-9b") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    参考图片（最多 {imageModel === "flux-2-pro" ? "8" : "4"} 张，可选）
                  </label>
                  <ImageUploader 
                    images={images} 
                    onImagesChange={setImages} 
                    maxImages={imageModel === "flux-2-pro" ? 8 : 4} 
                  />
                </div>
              )}

              {/* Aspect Ratio - 只在视频模式显示 */}
              {mode !== "text-to-image" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    画面比例
                  </label>
                  <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
                </div>
              )}

              {/* Generation Mode - 只在视频模式显示 */}
              {mode !== "text-to-image" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    生成模式
                  </label>
                  <ModeSelector value={generationMode} onChange={setGenerationMode} />
                </div>
              )}

              {/* Image Model - 只在文生图模式显示 */}
              {mode === "text-to-image" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    图片模型
                  </label>
                  <ImageModelSelector value={imageModel} onChange={setImageModel} />
                </div>
              )}

              {/* Image Aspect Ratio - 只在文生图模式显示 */}
              {mode === "text-to-image" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    画面比例
                  </label>
                  <ImageAspectRatioSelector 
                    value={imageAspectRatio} 
                    onChange={setImageAspectRatio}
                    model={imageModel}
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm overflow-hidden">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="break-all">{error}</span>
                </div>
              )}

              {/* Countdown info */}
              {showCountdown && countdown > 0 && !isGenerating && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  API 限制：1 分钟只能请求 1 次。还需等待 {countdown} 秒
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || countdown > 0}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed neon-glow transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {progress || "生成中..."}
                  </>
                ) : countdown > 0 ? (
                  <>
                    <Loader2 className="w-5 h-5" />
                    请等待 {countdown} 秒（API 限制）
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    开始生成
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right column - Result */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {isGenerating ? (
              <div className="glass-card neon-border p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-flip">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold gradient-text">生成中...</h3>
                  <p className="text-sm text-muted-foreground">
                    {progress || "正在处理您的请求"}
                  </p>
                  <p className="text-xs text-muted-foreground/60 font-mono">
                    已用时: {elapsedTime} 秒
                  </p>
                </div>
              </div>
            ) : result ? (
              <ResultDisplay result={result} />
            ) : (
              <div className="glass-card neon-border p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary/50" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground/60">等待生成</h3>
                  <p className="text-sm text-muted-foreground">
                    输入提示词并点击生成按钮<br />结果将显示在这里
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-white/60 pt-8 mt-8 border-t border-border/30">
          Copyright © 2025 <a href="https://as3.5918918.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">蓝色空间-AI 故事创作平台</a>. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
