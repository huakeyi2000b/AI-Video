import { cn } from "@/lib/utils";
import { Flame, Sparkles, Smile } from "lucide-react";

interface ModeSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

const modes = [
  { label: "正常", value: "normal", icon: Sparkles, desc: "标准生成" },
  { label: "辣味", value: "spicy", icon: Flame, desc: "更大胆" },
  { label: "趣味", value: "fun", icon: Smile, desc: "更有趣" },
];

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-3">
      {modes.map((m) => {
        const Icon = m.icon;
        return (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={cn(
              "flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-300 cursor-pointer",
              value === m.value
                ? "border-primary/60 bg-primary/10 neon-border"
                : "border-border/50 bg-secondary/30 hover:border-border hover:bg-secondary/50"
            )}
          >
            <Icon className={cn(
              "w-6 h-6",
              value === m.value ? "text-primary" : "text-muted-foreground"
            )} />
            <span
              className={cn(
                "text-sm font-medium",
                value === m.value ? "text-primary" : "text-muted-foreground"
              )}
            >
              {m.label}
            </span>
            <span className="text-xs text-muted-foreground/60">
              {m.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
