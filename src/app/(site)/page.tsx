import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const { data: configuracaoSite } = await sanityFetch({
    query: configuracaoSiteQuery,
  });

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-navy">Teste de conexão Sanity</h1>
      <pre className="mt-4 text-sm">{JSON.stringify(configuracaoSite, null, 2)}</pre>
    </div>
  );
}