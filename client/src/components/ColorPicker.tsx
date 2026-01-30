import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy, Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  "#3b82f6", // blue-500 (default)
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
  "#0ea5e9", // sky-500
];

export function ColorPicker({ value, onChange, label = "Color" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoverColor, setHoverColor] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div>
            <Button variant="outline" className="w-full justify-start gap-3">
              <div
                className="w-6 h-6 rounded border-2 border-slate-200"
                style={{ backgroundColor: value }}
              />
              <span className="text-sm font-mono">{value.toUpperCase()}</span>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            {/* Color Preview */}
            <div
              className="w-full h-20 rounded-lg border-2 border-slate-200 shadow-sm"
              style={{ backgroundColor: value }}
            />

            {/* Custom Color Input */}
            <div className="space-y-2">
              <Label htmlFor="hex-input" className="text-xs text-slate-500">
                Custom Color (Hex)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="hex-input"
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(val) || val === "") {
                      onChange(val || "#3b82f6");
                    }
                  }}
                  placeholder="#3b82f6"
                  className="font-mono text-sm flex-1"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Preset Colors */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Preset Colors</Label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    className={`w-8 h-8 rounded border-2 transition-all relative ${
                      value === color ? "border-slate-900" : "border-slate-300"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {value === color && (
                      <div className="absolute inset-0 rounded border-2 border-slate-900" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Info */}
            {hoverColor && (
              <div className="text-xs text-slate-500 text-center p-2 bg-slate-50 rounded">
                {hoverColor.toUpperCase()}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
