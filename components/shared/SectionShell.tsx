import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Surface = "default" | "alt" | "deep";

interface SectionShellProps extends HTMLAttributes<HTMLElement> {
  surface?: Surface;
  bleed?: boolean;
}

const surfaceMap: Record<Surface, string> = {
  default: "section-surface",
  alt: "section-surface-alt",
  deep: "section-surface-deep",
};

export default function SectionShell({
  surface = "default",
  bleed = false,
  className,
  children,
  ...rest
}: SectionShellProps) {
  return (
    <section
      {...rest}
      className={cn("relative overflow-hidden section-y", surfaceMap[surface], className)}
    >
      {bleed ? (
        children
      ) : (
        <div className="container mx-auto px-4 max-w-container">{children}</div>
      )}
    </section>
  );
}
