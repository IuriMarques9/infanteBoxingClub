import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Tone = "gold" | "green" | "red" | "blue" | "purple" | "neutral";
type Size = "sm" | "md";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
}

const toneStyles: Record<Tone, string> = {
  gold:    "bg-primary/15 text-primary ring-primary/30",
  green:   "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  red:     "bg-red-500/15 text-red-300 ring-red-500/30",
  blue:    "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  purple:  "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  neutral: "bg-white/10 text-white/70 ring-white/15",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-[10px] px-2 py-0.5 tracking-wide",
  md: "text-xs px-2.5 py-1 tracking-wide",
};

export default function Chip({
  tone = "neutral",
  size = "sm",
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold uppercase ring-1",
        toneStyles[tone],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
