// src/components/layout/Footer.tsx
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/lib/navigation";
import {
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";

export async function Footer() {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });

  const enderecoLinha =
    config?.logradouro && config?.cidade && config?.estado
      ? `${config.logradouro} — ${config.cidade}/${config.estado}`
      : config?.endereco;

  const regiao =
    config?.regiaoAtendimento && config.regiaoAtendimento.length > 0
      ? config.regiaoAtendimento.join(" • ")
      : "Jacareí • São José dos Campos • Vale do Paraíba";

  const redesSociais = [
    { url: config?.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { url: config?.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { url: config?.youtubeUrl, label: "YouTube", Icon: YouTubeIcon },
  ].filter((rede) => rede.url);

  return (
    <footer className="bg-navy text-white">
      <Container className="flex flex-col gap-10 py-12 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3">
          <div>
            <span className="font-display text-xl">BEZEL</span>
            <p className="mt-1 text-sm text-white/70">
              Arquitetura • Engenharia • Construção
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-white/50">
            {enderecoLinha && <p>{enderecoLinha}</p>}
            {config?.cnpj && <p>CNPJ: {config.cnpj}</p>}
            <p>{regiao}</p>
          </div>
          {redesSociais.length > 0 && (
            <div className="mt-2 flex gap-5">
              {redesSociais.map(({ url, label, Icon }) => (
                <a
                  key={label}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/70 transition-colors hover:text-gold"
                >
                  <Icon className="h-10 w-10" />
                </a>
              ))}
            </div>
          )}
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