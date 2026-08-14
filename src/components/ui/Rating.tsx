// src/components/ui/Rating.tsx
interface RatingProps {
  nota: number;
}

export function Rating({ nota }: RatingProps) {
  return (
    <div className="flex gap-1 text-gold" aria-label={`Avaliação: ${nota} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} aria-hidden="true">
          {index < nota ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}