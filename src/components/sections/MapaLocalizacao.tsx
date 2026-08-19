// src/components/sections/MapaLocalizacao.tsx
interface MapaLocalizacaoProps {
  logradouro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
}

export function MapaLocalizacao({
  logradouro,
  cidade,
  estado,
  cep,
}: MapaLocalizacaoProps) {
  if (!logradouro) return null;

  const enderecoCompleto = [logradouro, cidade, estado, cep]
    .filter(Boolean)
    .join(", ");
  const query = encodeURIComponent(enderecoCompleto);

  return (
    <div className="aspect-video overflow-hidden rounded-lg border border-navy/10">
      <iframe
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        title={`Localização da BEZEL: ${enderecoCompleto}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}