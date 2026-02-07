import { cn } from "@/lib/utils";

interface AspectRatioSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

const ratios = [
  { label: "3:2", value: "3:2", icon: "▬", desc: "横屏" },
  { label: "1:1", value: "1:1", icon: "◼", desc: "方形" },
  { label: "2:3", value: "2:3", icon: "▮", desc: "竖屏" },
];

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="flex gap-3">
      {ratios.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={cn(
            "flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-300 cursor-pointer",
            value === r.value
              ? "border-primary/60 bg-primary/10 neon-border"
              : "border-border/50 bg-secondary/30 hover:border-border hover:bg-secondary/50"
          )}
        >
          <span className="text-2xl leading-none">{r.icon}</span>
          <span
            className={cn(
              "text-sm font-medium",
              value === r.value ? "text-primary" : "text-muted-foreground"
            )}
          >
            {r.label}
          </span>
          <span className="text-xs text-muted-foreground/60">
            {r.desc}
          </span>
        </button>
      ))}
    </div>
  );
}
