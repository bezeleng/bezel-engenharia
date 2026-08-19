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
}

export function getOrganizationSchema(config: ConfiguracaoSiteData | null) {
  if (!config) return null;

  const temEnderecoEstruturado = Boolean(
    config.logradouro && config.cidade && config.estado
  );

  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: config.nomeEmpresa,
    url: "https://bezel.com.br",
    telephone: config.telefone,
    email: config.email,
    taxID: config.cnpj ?? undefined,
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