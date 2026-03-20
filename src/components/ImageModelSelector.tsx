import { Sparkles } from "lucide-react";

interface ImageModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const models = [
  { id: "imagen-3", name: "Imagen 3", icon: "🎨" },
  { id: "flux-2-pro", name: "Flux 2 Pro", icon: "⚡" },
  { id: "flux-2-dev", name: "Flux 2 Dev", icon: "🔧" },
  { id: "flux-2-klein-4b", name: "Flux Klein 4B", icon: "🚀" },
  { id: "flux-2-klein-9b", name: "Flux Klein 9B", icon: "💎" },
  { id: "plutogen-o1", name: "Plutogen O1", icon: "🌟" },
  { id: "z-image", name: "Z-Image", icon: "⚡" },
  { id: "special-berry", name: "Special Berry", icon: "🍓" },
  { id: "dirtberry", name: "Dirtberry", icon: "🫐" },
];

export function ImageModelSelector({ value, onChange }: ImageModelSelectorProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onChange(model.id)}
          className={`relative py-3 px-3 rounded-lg border transition-all duration-300 ${
            value === model.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 hover:border-primary/40 hover:bg-secondary/30 text-muted-foreground"
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">{model.icon}</span>
            <span className="text-xs font-medium">{model.name}</span>
          </div>
          {value === model.id && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
