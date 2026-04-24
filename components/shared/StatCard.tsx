import { cn } from "@/lib/utils";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type Tone = "gold" | "green" | "red" | "blue" | "neutral";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: ReactNode;
  tone?: Tone;
  badge?: string;
  href?: string;
  hint?: string;
}

const toneStyles: Record<Tone, { ring: string; icon: string; value: string }> = {
  gold:    { ring: "ring-primary/30",       icon: "text-primary bg-primary/10",          value: "text-primary" },
  green:   { ring: "ring-emerald-500/30",   icon: "text-emerald-400 bg-emerald-500/10",  value: "text-emerald-300" },
  red:     { ring: "ring-red-500/30",       icon: "text-red-400 bg-red-500/10",          value: "text-red-300" },
  blue:    { ring: "ring-sky-500/30",       icon: "text-sky-400 bg-sky-500/10",          value: "text-sky-300" },
  neutral: { ring: "ring-white/10",         icon: "text-white/70 bg-white/5",            value: "text-white" },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  tone = "gold",
  badge,
  href,
  hint,
}: StatCardProps) {
  const styles = toneStyles[tone];
  const body = (
    <div
      className={cn(
        "panel-padded flex flex-col gap-3 h-full transition-colors",
        "hover:bg-[#161616]",
        styles.ring,
        href && "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
          {label}
        </span>
        {Icon && (
          <span className={cn("p-2 rounded-lg", styles.icon)}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className={cn("text-3xl font-bold font-headline tracking-wide", styles.value)}>
        {value}
      </div>
      {(badge || hint) && (
        <div className="flex items-center justify-between text-xs">
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/60">{badge}</span>
          )}
          {hint && <span className="text-white/50">{hint}</span>}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{body}</Link>;
  }
  return body;
}
