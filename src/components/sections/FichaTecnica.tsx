// src/components/sections/FichaTecnica.tsx
interface FichaTecnicaProps {
  cliente?: string;
  area?: number;
  ano?: number;
  localizacao?: string;
}

export function FichaTecnica({
  cliente,
  area,
  ano,
  localizacao,
}: FichaTecnicaProps) {
  const itens = [
    { label: "Cliente", valor: cliente },
    { label: "Área", valor: area ? `${area} m²` : undefined },
    { label: "Ano", valor: ano ? String(ano) : undefined },
    { label: "Localização", valor: localizacao },
  ].filter((item) => item.valor);

  if (itens.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-6 border-y border-navy/10 py-6 sm:grid-cols-4">
      {itens.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-medium uppercase tracking-widest text-gold">
            {item.label}
          </dt>
          <dd className="mt-1 text-navy">{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}