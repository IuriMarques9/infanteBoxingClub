import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 mb-12 md:mb-16",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className="font-headline text-5xl md:text-6xl uppercase tracking-wider text-primary font-semibold leading-none">
        {title}
        {titleHighlight && (
          <>
            {" "}
            <span className="text-primary/90">{titleHighlight}</span>
          </>
        )}
      </h2>
      <div className="section-divider" style={align === "start" ? { marginLeft: 0, marginRight: 0 } : undefined} />
      {subtitle && (
        <p
          className={cn(
            "text-white/70 max-w-3xl text-pretty",
            align === "center" ? "text-center mx-auto" : "text-left"
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
