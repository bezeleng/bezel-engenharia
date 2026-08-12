// src/components/ui/PortableTextContent.tsx
import { PortableText, type PortableTextComponents } from "@portabletext/react";

interface PortableTextContentProps {
  value: NonNullable<unknown>;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display mt-8 mb-4 text-2xl text-navy">{children}</h2>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-navy">{children}</strong>,
  },
};

export function PortableTextContent({ value }: PortableTextContentProps) {
  return (
    <div className="text-foreground/80">
      <PortableText value={value} components={components} />
    </div>
  );
}