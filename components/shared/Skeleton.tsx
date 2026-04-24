import { cn } from "@/lib/utils";

type Variant = "line" | "card" | "text" | "circle" | "rect";

interface SkeletonProps {
  variant?: Variant;
  count?: number;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  line:   "h-4 w-full",
  text:   "h-3 w-3/4",
  card:   "aspect-[4/5] w-full",
  rect:   "h-24 w-full",
  circle: "h-10 w-10 rounded-full",
};

export default function Skeleton({ variant = "line", count = 1, className }: SkeletonProps) {
  const items = Array.from({ length: count });
  return (
    <>
      {items.map((_, i) => (
        <div key={i} className={cn("skeleton", variantStyles[variant], className)} />
      ))}
    </>
  );
}
