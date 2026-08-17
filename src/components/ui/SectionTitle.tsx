// src/components/ui/SectionTitle.tsx
interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionTitleProps) {
  const alignClasses = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClasses}`}>
      {eyebrow && (
        <span className="text-sm font-medium uppercase tracking-widest text-gold-text">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl text-navy sm:text-4xl">{title}</h2>
      {description && (
        <p className="max-w-2xl text-base text-foreground/70">{description}</p>
      )}
    </div>
  );
}