import { useState } from "react";
import { X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onImagesChange, maxImages = 2 }: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const addImageFromUrl = () => {
    if (!urlInput.trim()) return;
    
    // 简单验证 URL
    try {
      const url = urlInput.trim();
      new URL(url);
      
      // 检查是否是 HTTPS
      if (!url.startsWith('https://')) {
        alert("请使用 HTTPS 协议的图片链接");
        return;
      }
      
      if (images.length < maxImages) {
        onImagesChange([...images, url]);
        setUrlInput("");
        setShowUrlInput(false);
      }
    } catch {
      alert("请输入有效的图片 URL");
    }
  };

  if (images.length > 0) {
    return (
      <div className="space-y-3">
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
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-background/80 backdrop-blur-sm text-xs">
                图片 {index + 1}
              </div>
            </div>
          ))}
        </div>
        {images.length < maxImages && (
          <div className="space-y-2">
            {showUrlInput ? (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addImageFromUrl();
                      if (e.key === 'Escape') {
                        setShowUrlInput(false);
                        setUrlInput("");
                      }
                    }}
                    placeholder="粘贴图片 URL (https://...)"
                    className="flex-1 px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    autoFocus
                  />
                  <button
                    onClick={addImageFromUrl}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
                  >
                    添加
                  </button>
                  <button
                    onClick={() => {
                      setShowUrlInput(false);
                      setUrlInput("");
                    }}
                    className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors"
                  >
                    取消
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 输入完成后按 Enter 添加，按 Esc 取消
                </p>
              </>
            ) : (
              <button
                onClick={() => setShowUrlInput(true)}
                className="w-full py-3 rounded-lg border border-dashed border-border/50 hover:border-primary/40 hover:bg-secondary/30 transition-all text-sm text-muted-foreground flex items-center justify-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                添加第 {images.length + 1} 张图片（粘贴链接）
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {showUrlInput ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addImageFromUrl();
                if (e.key === 'Escape') {
                  setShowUrlInput(false);
                  setUrlInput("");
                }
              }}
              placeholder="粘贴图片 URL (https://...)"
              className="flex-1 px-3 py-3 bg-secondary/30 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              autoFocus
            />
            <button
              onClick={addImageFromUrl}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              添加
            </button>
            <button
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput("");
              }}
              className="px-4 py-3 rounded-lg bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors"
            >
              取消
            </button>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            输入完成后按 Enter 添加，按 Esc 取消
          </p>
        </div>
      ) : (
        <button
          onClick={() => setShowUrlInput(true)}
          className="w-full h-36 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/40 hover:bg-secondary/30 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer"
        >
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
          <div className="text-center">
            <span className="text-sm text-foreground font-medium block">
              粘贴图片链接
            </span>
            <span className="text-xs text-muted-foreground/60 block mt-1">
              支持公开可访问的 HTTPS 图片链接（最多 {maxImages} 张）
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
