import { Download, ExternalLink } from "lucide-react";

interface ResultDisplayProps {
  result: {
    type: string;
    url: string;
    prompt: string;
    timestamp: number;
  };
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const isImage = result.type === "image";
  
  const handleDownload = async () => {
    try {
      const response = await fetch(result.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${isImage ? 'image' : 'video'}_${result.timestamp}.${isImage ? 'jpg' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      // 如果跨域下载失败，回退到直接打开
      window.open(result.url, '_blank');
    }
  };
  
  return (
    <div className="glass-card neon-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">生成结果</h3>
        <div className="flex gap-2">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="在新标签页打开"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors text-primary"
            title="下载"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-border/30 bg-background/50">
        {isImage ? (
          <img
            src={result.url}
            alt={result.prompt}
            className="w-full max-h-[600px] object-contain"
          />
        ) : (
          <video
            src={result.url}
            controls
            autoPlay
            loop
            className="w-full max-h-[500px] object-contain"
          >
            <source src={result.url} />
            你的浏览器不支持视频播放，
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              点击下载
            </a>
          </video>
        )}
      </div>

      <p className="text-xs text-muted-foreground truncate">
        提示词: {result.prompt}
      </p>
    </div>
  );
}
