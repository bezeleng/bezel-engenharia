import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationSchema } from "@/lib/schema-org";
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
      {organizationSchema && <JsonLd data={organizationSchema} />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}