import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  cta?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, cta, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 py-16 px-6",
        "rounded-2xl border border-white/5 bg-white/[0.02]",
        className
      )}
    >
      {Icon && (
        <span className="p-4 rounded-full bg-primary/10 text-primary/70">
          <Icon className="h-8 w-8" />
        </span>
      )}
      <h3 className="text-xl font-headline uppercase tracking-wider text-white">{title}</h3>
      {description && <p className="text-white/60 max-w-md text-sm">{description}</p>}
      {cta && <div className="mt-2">{cta}</div>}
    </div>
  );
}
