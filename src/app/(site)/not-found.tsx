import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="font-display text-8xl text-gold">404</span>
        <h1 className="font-display text-3xl text-navy sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="max-w-md text-foreground/70">
          A página que você procura pode ter sido removida, renomeada ou
          nunca existiu.
        </p>
        <Button href="/" variant="primary">
          Voltar para a Home
        </Button>
      </Container>
    </main>
  );
}