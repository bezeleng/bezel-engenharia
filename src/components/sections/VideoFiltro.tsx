// src/components/sections/VideoFiltro.tsx
interface CategoriaOpcao {
  _id: string;
  nome?: string | null;
}

interface VideoFiltroProps {
  categorias: CategoriaOpcao[];
  categoriaAtiva: string | null;
  onSelect: (categoriaId: string | null) => void;
}

export function VideoFiltro({
  categorias,
  categoriaAtiva,
  onSelect,
}: VideoFiltroProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          categoriaAtiva === null
            ? "border-navy bg-navy text-white"
            : "border-navy/20 text-navy hover:border-gold"
        }`}
      >
        Todos
      </button>
      {categorias.map((categoria) => (
        <button
          key={categoria._id}
          onClick={() => onSelect(categoria._id)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            categoriaAtiva === categoria._id
              ? "border-navy bg-navy text-white"
              : "border-navy/20 text-navy hover:border-gold"
          }`}
        >
          {categoria.nome}
        </button>
      ))}
    </div>
  );
}