// src/components/sections/ListaSimples.tsx
interface ListaSimplesProps {
  titulo: string;
  itens?: string[] | null;
}

export function ListaSimples({ titulo, itens }: ListaSimplesProps) {
  if (!itens || itens.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-xl text-navy">{titulo}</h3>
      <ul className="mt-4 flex flex-col gap-2">
        {itens.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-foreground/80">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}