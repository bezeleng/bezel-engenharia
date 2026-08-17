// src/components/layout/Footer.tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
        <div>
          <span className="font-display text-xl">BEZEL</span>
          <p className="mt-2 max-w-xs text-sm text-white/80">
            Arquitetura • Engenharia • Construção
          </p>
          <p className="mt-1 max-w-xs text-sm text-white/50">
            Jacareí • São José dos Campos 
            <br />
            Vale do Paraíba
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/80 hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>

      <div className="border-t border-white/10 py-4">
        <Container className="flex flex-col gap-2 text-xs text-white/60 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} BEZEL Engenharia. Todos os direitos reservados.</span>
          <Link href="/politica-de-privacidade" className="hover:text-gold">
            Política de Privacidade
          </Link>
        </Container>
      </div>
    </footer>
  );
}