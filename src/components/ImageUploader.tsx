import { useState, useRef } from "react";
import { X, Image as ImageIcon, Link as LinkIcon, Upload, Loader2, Copy, Check } from "lucide-react";
import { uploadToOSS } from "@/lib/ossUpload";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onImagesChange, maxImages = 2 }: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyUrl = async (url: string, index: number) => {
    console.log("复制的URL:", url);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // fallback for non-HTTPS
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error("复制失败", e);
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const addImageFromUrl = () => {
    if (!urlInput.trim()) return;
    try {
      const url = urlInput.trim();
      new URL(url);
      if (!url.startsWith("https://")) {
        setUploadError("请使用 HTTPS 协议的图片链接");
        return;
      }
      if (images.length < maxImages) {
        onImagesChange([...images, url]);
        setUrlInput("");
        setShowUrlInput(false);
        setUploadError("");
      }
    } catch {
      setUploadError("请输入有效的图片 URL");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = maxImages - images.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    setUploadError("");

    try {
      const urls = await Promise.all(toUpload.map((f) => uploadToOSS(f)));
      onImagesChange([...images, ...urls]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const AddMoreButtons = () => (
    <div className="space-y-2">
      {showUrlInput ? (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addImageFromUrl();
                if (e.key === "Escape") { setShowUrlInput(false); setUrlInput(""); }
              }}
              placeholder="粘贴图片 URL (https://...)"
              className="flex-1 px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              autoFocus
            />
            <button onClick={addImageFromUrl} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">
              添加
            </button>
            <button onClick={() => { setShowUrlInput(false); setUrlInput(""); }} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors">
              取消
            </button>
          </div>
          <p className="text-xs text-muted-foreground">按 Enter 添加，按 Esc 取消</p>
        </>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 py-3 rounded-lg border border-dashed border-border/50 hover:border-primary/40 hover:bg-secondary/30 transition-all text-sm text-muted-foreground flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "上传中..." : "上传本地图片"}
          </button>
          <button
            onClick={() => setShowUrlInput(true)}
            className="flex-1 py-3 rounded-lg border border-dashed border-border/50 hover:border-primary/40 hover:bg-secondary/30 transition-all text-sm text-muted-foreground flex items-center justify-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            粘贴图片链接
          </button>
        </div>
      )}
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  );

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-border/50">
              <img
                src={img}
                alt={`参考图片 ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">加载失败</text></svg>';
                }}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyUrl(img, index)}
                className="absolute top-2 left-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
                title="复制链接"
              >
                {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-xs">
                图片 {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        images.length === 0 ? (
          <div className="space-y-3">
            {showUrlInput ? (
              <AddMoreButtons />
            ) : (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-36 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/40 hover:bg-secondary/30 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  )}
                  <div className="text-center">
                    <span className="text-sm text-foreground font-medium block">
                      {uploading ? "上传中..." : "上传本地图片"}
                    </span>
                    <span className="text-xs text-muted-foreground/60 block mt-1">
                      或
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setShowUrlInput(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-border/50 hover:border-primary/40 hover:bg-secondary/30 transition-all text-sm text-muted-foreground flex items-center justify-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  粘贴图片链接
                </button>
                {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
              </>
            )}
          </div>
        ) : (
          <AddMoreButtons />
        )
      )}
    </div>
  );
}
