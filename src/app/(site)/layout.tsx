import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationSchema } from "@/lib/schema-org";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { GoogleTagManagerNoScript } from "@/components/analytics/GoogleTagManagerNoScript";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });
  const organizationSchema = getOrganizationSchema(config);

  return (
    <>
      <GoogleTagManager />
      {organizationSchema && <JsonLd data={organizationSchema} />}
      <GoogleTagManagerNoScript />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton
        whatsapp={config?.whatsapp}
        mensagem={config?.mensagemWhatsapp}
      />
    </>
  );
}