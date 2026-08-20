// src/components/layout/WhatsAppButton.tsx
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

interface WhatsAppButtonProps {
  whatsapp?: string | null;
  mensagem?: string | null;
}

const MENSAGEM_PADRAO =
  "Olá! Vim pelo site da BEZEL e gostaria de conversar sobre meu projeto.";

export function WhatsAppButton({ whatsapp, mensagem }: WhatsAppButtonProps) {
  if (!whatsapp) return null;

  const texto = encodeURIComponent(mensagem || MENSAGEM_PADRAO);
  const link = `https://wa.me/${whatsapp}?text=${texto}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      title="Fale conosco no WhatsApp"
      className="fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}