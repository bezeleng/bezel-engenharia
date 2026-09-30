const ALIASES_SEGMENTO: Array<{ nome: string; termos: string[] }> = [
  {
    nome: "Imobiliárias",
    termos: [
      "imobiliaria", "imobiliarias", "corretora de imoveis", "corretoras de imoveis",
      "corretagem imobiliaria", "administracao de imoveis", "real estate", "realty",
    ],
  },
  {
    nome: "Administradoras de condomínios",
    termos: [
      "administradora de condominio", "administradoras de condominio",
      "administracao de condominio", "administracao de condominios",
      "administracao condominial", "gestao condominial", "gestao de condominio",
      "gestao de condominios", "sindico", "sindicos", "sindico profissional",
      "sindicos profissionais",
    ],
  },
  {
    nome: "Arquitetura",
    termos: ["arquiteto", "arquitetos", "arquitetura", "escritorio de arquitetura", "escritorios de arquitetura"],
  },
  {
    nome: "Engenharia",
    termos: ["engenheiro", "engenheiros", "engenharia", "empresa de engenharia", "empresas de engenharia"],
  },
  {
    nome: "Escolas",
    termos: ["escola", "escolas", "colegio", "colegios", "instituicao de ensino", "instituicoes de ensino"],
  },
  {
    nome: "Clínicas",
    termos: ["clinica", "clinicas", "consultorio", "consultorios", "centro de saude", "centros de saude"],
  },
  {
    nome: "Geral",
    termos: ["geral"],
  },
];

export function chaveSegmento(valor?: string) {
  return (valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tituloSegmento(valor: string) {
  const limpo = valor.trim().replace(/\s+/g, " ");
  if (!limpo) return "Geral";
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

export function normalizarSegmento(valor?: string) {
  const chave = chaveSegmento(valor);
  if (!chave) return "Geral";

  const alias = ALIASES_SEGMENTO.find((grupo) =>
    grupo.termos.some((termo) => {
      const chaveTermo = chaveSegmento(termo);
      return chave === chaveTermo || chave.includes(chaveTermo) || chaveTermo.includes(chave);
    })
  );

  return alias?.nome || tituloSegmento(valor || "");
}
