// src/components/layout/Header.tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";
import { navLinks } from "@/lib/navigation";
import Image from "next/image";

export function Header() {
  return (
    <header className="relative z-50 border-b border-navy/10 bg-white">
      <Container className="flex items-center justify-between py-3 sm:py-4">
        <Link href="/" className="flex items-center" aria-label="BEZEL - Página inicial">
  <Image
    src="/logo-bezel.svg"
    alt="BEZEL"
    width={180}
    height={60}
    priority
    className="h-auto w-[115px] sm:w-[170px]"
  />
</Link>

        <nav className="hidden gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-navy hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:block">
          <Button href="/orcamento" variant="primary">
            Solicitar Orçamento
          </Button>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}