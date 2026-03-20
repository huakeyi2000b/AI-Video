interface ImageAspectRatioSelectorProps {
  value: string;
  onChange: (value: string) => void;
  model: string;
}

const ratios = {
  "imagen-3": [
    { id: "1:1", label: "1:1", desc: "正方形" },
  ],
  "flux-2-pro": [
    { id: "1:1", label: "1:1", desc: "正方形" },
    { id: "4:3", label: "4:3", desc: "横向" },
    { id: "3:4", label: "3:4", desc: "竖向" },
    { id: "16:9", label: "16:9", desc: "宽屏" },
    { id: "9:16", label: "9:16", desc: "竖屏" },
    { id: "3:2", label: "3:2", desc: "横向" },
    { id: "2:3", label: "2:3", desc: "竖向" },
  ],
  "flux-2-dev": [
    { id: "1024:1024", label: "1:1", desc: "正方形" },
  ],
  "flux-2-klein-4b": [
    { id: "1024:1024", label: "1:1", desc: "正方形" },
  ],
  "flux-2-klein-9b": [
    { id: "1024:1024", label: "1:1", desc: "正方形" },
  ],
  "plutogen-o1": [
    { id: "1024:1024", label: "1:1", desc: "正方形" },
  ],
  "z-image": [
    { id: "1:1", label: "1:1", desc: "正方形" },
    { id: "16:9", label: "16:9", desc: "宽屏" },
    { id: "9:16", label: "9:16", desc: "竖屏" },
    { id: "4:3", label: "4:3", desc: "横向" },
    { id: "3:4", label: "3:4", desc: "竖向" },
  ],
  "special-berry": [
    { id: "1:1", label: "1:1", desc: "正方形" },
  ],
  "dirtberry": [
    { id: "1:1", label: "1:1", desc: "正方形" },
  ],
};

export function ImageAspectRatioSelector({ value, onChange, model }: ImageAspectRatioSelectorProps) {
  const availableRatios = ratios[model as keyof typeof ratios] || ratios["flux-2-pro"];

  return (
    <div className="grid grid-cols-4 gap-2">
      {availableRatios.map((ratio) => (
        <button
          key={ratio.id}
          onClick={() => onChange(ratio.id)}
          className={`py-2.5 px-3 rounded-lg border transition-all duration-300 ${
            value === ratio.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 hover:border-primary/40 hover:bg-secondary/30 text-muted-foreground"
          }`}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-semibold">{ratio.label}</span>
            <span className="text-xs opacity-70">{ratio.desc}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
