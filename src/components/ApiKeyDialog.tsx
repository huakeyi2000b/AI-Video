import { useState } from "react";
import { Settings, Key, Eye, EyeOff, X } from "lucide-react";

interface ApiKeyDialogProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ApiKeyDialog({ apiKey, onApiKeyChange }: ApiKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    onApiKeyChange(inputValue);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setInputValue(apiKey);
          setOpen(true);
        }}
        className="group relative flex items-center gap-2 px-4 py-2.5 glass-card neon-border hover:neon-glow transition-all duration-300 cursor-pointer"
      >
        <Settings className="w-4 h-4 text-primary group-hover:animate-spin" />
        <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
          {apiKey ? "已配置 API Key" : "设置 API Key"}
        </span>
        {apiKey && (
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative glass-card neon-border p-8 w-full max-w-md mx-4 space-y-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold gradient-text">API Key 设置</h2>
              <p className="text-sm text-muted-foreground">
                输入一个或多个 API Key（每行一个或用逗号分隔）
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                API Key（支持多个轮换）
              </label>
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="sk-air-...&#10;sk-air-...&#10;sk-air-..."
                  rows={4}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm transition-all resize-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                多个 Key 会自动轮换使用，每分钟切换一次
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 neon-glow transition-all font-medium"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
