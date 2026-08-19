// src/components/sections/FichaTecnicaObra.tsx
const tipoObraLabel: Record<string, string> = {
  construcao_nova: "Construção Nova",
  reforma: "Reforma",
  ampliacao: "Ampliação",
  retrofit: "Retrofit",
};

const statusLabel: Record<string, string> = {
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

interface FichaTecnicaObraProps {
  tipoObra?: string | null;
  localizacao?: string | null;
  area?: number | null;
  metragemTerreno?: number | null;
  metragemConstruida?: number | null;
  ano?: number | null;
  prazoObra?: string | null;
  status?: string | null;
  cliente?: string | null;
  exibirClientePublicamente?: boolean | null;
}

export function FichaTecnicaObra({
  tipoObra,
  localizacao,
  area,
  metragemTerreno,
  metragemConstruida,
  ano,
  prazoObra,
  status,
  cliente,
  exibirClientePublicamente,
}: FichaTecnicaObraProps) {
  const itens = [
    {
      label: "Tipo de Obra",
      valor: tipoObra ? tipoObraLabel[tipoObra] ?? tipoObra : undefined,
    },
    { label: "Localização", valor: localizacao ?? undefined },
    { label: "Área", valor: area ? `${area} m²` : undefined },
    {
      label: "Terreno",
      valor: metragemTerreno ? `${metragemTerreno} m²` : undefined,
    },
    {
      label: "Área Construída",
      valor: metragemConstruida ? `${metragemConstruida} m²` : undefined,
    },
    { label: "Ano", valor: ano ? String(ano) : undefined },
    { label: "Prazo", valor: prazoObra ?? undefined },
    {
      label: "Status",
      valor: status ? statusLabel[status] ?? status : undefined,
    },
    {
      label: "Cliente",
      valor:
        exibirClientePublicamente && cliente ? cliente : undefined,
    },
  ].filter((item) => item.valor);

  if (itens.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-6 border-y border-navy/10 py-6 sm:grid-cols-4">
      {itens.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-medium uppercase tracking-widest text-gold-text">
            {item.label}
          </dt>
          <dd className="mt-1 text-navy">{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}