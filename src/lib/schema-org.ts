// src/lib/schema-org.ts
interface ConfiguracaoSiteData {
  nomeEmpresa?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}

export function getOrganizationSchema(config: ConfiguracaoSiteData | null) {
  if (!config) return null;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.nomeEmpresa,
    url: "https://bezel.com.br",
    telephone: config.telefone,
    email: config.email,
    address: config.endereco
      ? {
          "@type": "PostalAddress",
          streetAddress: config.endereco,
        }
      : undefined,
  };
}