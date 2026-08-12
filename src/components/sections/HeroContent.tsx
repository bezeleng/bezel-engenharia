// src/components/sections/HeroContent.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface HeroContentProps {
  titulo: string;
  subtitulo?: string;
  textoCta?: string;
  linkCta?: string;
}

export function HeroContent({
  titulo,
  subtitulo,
  textoCta,
  linkCta,
}: HeroContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-start gap-6 text-white"
    >
      <h1 className="font-display max-w-2xl text-4xl sm:text-5xl">{titulo}</h1>
      {subtitulo && (
        <p className="max-w-xl text-lg text-white/85">{subtitulo}</p>
      )}
      {textoCta && linkCta && (
        <Button href={linkCta} variant="primary">
          {textoCta}
        </Button>
      )}
    </motion.div>
  );
}