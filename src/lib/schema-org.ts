// src/lib/schema-org.ts
interface ConfiguracaoSiteData {
  nomeEmpresa?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  logradouro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
  cnpj?: string | null;
  regiaoAtendimento?: string[] | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
}

export function getOrganizationSchema(config: ConfiguracaoSiteData | null) {
  if (!config) return null;

  const temEnderecoEstruturado = Boolean(
    config.logradouro && config.cidade && config.estado
  );

  const perfisSociais = [
    config.instagramUrl,
    config.facebookUrl,
    config.youtubeUrl,
  ].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": "https://bezel.com.br/#organization",
    name: config.nomeEmpresa,
    url: "https://bezel.com.br",
    telephone: config.telefone,
    email: config.email,
    taxID: config.cnpj ?? undefined,
    sameAs: perfisSociais.length > 0 ? perfisSociais : undefined,
    address: temEnderecoEstruturado
      ? {
          "@type": "PostalAddress",
          streetAddress: config.logradouro,
          addressLocality: config.cidade,
          addressRegion: config.estado,
          postalCode: config.cep ?? undefined,
          addressCountry: "BR",
        }
      : config.endereco
        ? {
            "@type": "PostalAddress",
            streetAddress: config.endereco,
          }
        : undefined,
    areaServed:
      config.regiaoAtendimento && config.regiaoAtendimento.length > 0
        ? config.regiaoAtendimento
        : undefined,
  };
}
