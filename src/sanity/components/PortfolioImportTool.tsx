"use client";

import { useState } from "react";
import { useClient } from "sanity";

type PortfolioFoto = {
  id: string;
  arquivo: string;
  pagina: number;
  posicao: number;
  etapa: "antes" | "durante" | "depois";
  titulo: string;
  legenda: string;
  alt: string;
  base64: string;
};

type PortfolioObra = {
  _id: string;
  slug: string;
  titulo: string;
  resumo: string;
  tipoObra: "construcao_nova";
  status: "registro_fotografico";
  descricao: string[];
  principaisServicos: string[];
  resultadosDestaques: string[];
  capaFoto: string;
  fotos: PortfolioFoto[];
};

type PortfolioImport = {
  format: "bezel-portfolio-v1";
  source: string;
  observacoes: string;
  obras: PortfolioObra[];
};

const API_VERSION = "2026-08-10";

function isPortfolio(data: unknown): data is PortfolioImport {
  if (typeof data !== "object" || data === null) return false;
  const value = data as Partial<PortfolioImport>;
  if (value.format !== "bezel-portfolio-v1" || !Array.isArray(value.obras)) {
    return false;
  }
  return (
    value.obras.length > 0 &&
    value.obras.length <= 15 &&
    value.obras.every(
      (obra) =>
        typeof obra._id === "string" &&
        /^bezel-portfolio-pdf-2026-[a-z0-9-]+$/.test(obra._id) &&
        typeof obra.slug === "string" &&
        /^[a-z0-9-]+$/.test(obra.slug) &&
        typeof obra.titulo === "string" &&
        typeof obra.resumo === "string" &&
        Array.isArray(obra.descricao) &&
        Array.isArray(obra.principaisServicos) &&
        Array.isArray(obra.resultadosDestaques) &&
        Array.isArray(obra.fotos) &&
        obra.fotos.length >= 2 &&
        obra.fotos.length <= 4 &&
        obra.fotos.some((foto) => foto.id === obra.capaFoto) &&
        obra.fotos.every(
          (foto) =>
            typeof foto.id === "string" &&
            typeof foto.base64 === "string" &&
            /^[A-Za-z0-9+/=]+$/.test(foto.base64) &&
            typeof foto.arquivo === "string" &&
            typeof foto.legenda === "string" &&
            ["antes", "durante", "depois"].includes(foto.etapa)
        )
    )
  );
}

function bloco(texto: string, index: number) {
  return {
    _type: "block",
    _key: `paragrafo-${index + 1}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `trecho-${index + 1}`,
        text: texto,
        marks: [],
      },
    ],
  };
}

function arquivoImagem(foto: PortfolioFoto) {
  const bytes = atob(foto.base64);
  const buffer = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index++) {
    buffer[index] = bytes.charCodeAt(index);
  }
  return new File([buffer], foto.arquivo, { type: "image/jpeg" });
}

export function PortfolioImportTool() {
  const client = useClient({ apiVersion: API_VERSION }).withConfig({
    perspective: "raw",
    useCdn: false,
  });
  const [pacote, setPacote] = useState<PortfolioImport | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [importando, setImportando] = useState(false);
  const [mensagens, setMensagens] = useState<string[]>([]);

  async function selecionarArquivo(file?: File) {
    setPacote(null);
    setConfirmado(false);
    setMensagens([]);
    if (!file) return;
    try {
      if (file.size > 15 * 1024 * 1024) {
        throw new Error("O arquivo deve ter no máximo 15 MB.");
      }
      const parsed: unknown = JSON.parse(await file.text());
      if (!isPortfolio(parsed)) {
        throw new Error("Arquivo inválido. Selecione o JSON de portfólio preparado para a BEZEL.");
      }
      setPacote(parsed);
    } catch (error) {
      setMensagens([error instanceof Error ? error.message : "Não foi possível ler o arquivo."]);
    }
  }

  async function importar(publicar: boolean) {
    if (!pacote || !confirmado || importando) return;
    setImportando(true);
    const logs: string[] = [];
    const addLog = (message: string) => {
      logs.push(message);
      setMensagens([...logs]);
    };

    try {
      const categoriaAtual = await client.fetch<{ _id: string } | null>(
        '*[_type == "categoria" && (nome == "Residencial" || slug.current == "residencial")][0]{_id}'
      );
      const categoriaId = categoriaAtual?._id ?? "bezel-categoria-residencial-portfolio";
      if (!categoriaAtual) {
        await client.createIfNotExists({
          _id: categoriaId,
          _type: "categoria",
          nome: "Residencial",
          slug: { _type: "slug", current: "residencial" },
        });
      }

      for (const obra of pacote.obras) {
        const jaExiste = await client.fetch<{ _id: string } | null>(
          '*[_id in [$publicado, $rascunho]][0]{_id}',
          { publicado: obra._id, rascunho: `drafts.${obra._id}` }
        );
        if (jaExiste) {
          addLog(`Já cadastrada (preservada): ${obra.titulo}`);
          continue;
        }

        addLog(`Enviando fotos de: ${obra.titulo}`);
        const assets = new Map<string, string>();
        for (const foto of obra.fotos) {
          const asset = await client.assets.upload("image", arquivoImagem(foto), {
            filename: foto.arquivo,
          });
          assets.set(foto.id, asset._id);
        }

        const capaAssetId = assets.get(obra.capaFoto);
        if (!capaAssetId) throw new Error(`Capa não encontrada para ${obra.titulo}`);

        const documento = {
          _id: publicar ? obra._id : `drafts.${obra._id}`,
          _type: "obra",
          titulo: obra.titulo,
          slug: { _type: "slug", current: obra.slug },
          categoria: {
            _type: "reference",
            _ref: categoriaId,
          },
          tipoObra: obra.tipoObra,
          status: obra.status,
          capa: {
            _type: "image",
            asset: { _type: "reference", _ref: capaAssetId },
          },
          capaAlt: obra.fotos.find((foto) => foto.id === obra.capaFoto)?.alt,
          galeria: obra.fotos
            .filter((foto) => foto.id !== obra.capaFoto)
            .map((foto, index) => ({
              _type: "itemGaleria",
              _key: foto.id,
              imagem: {
                _type: "image",
                asset: { _type: "reference", _ref: assets.get(foto.id)! },
              },
              alt: foto.alt,
              legenda: foto.legenda,
              etapa: foto.etapa,
              ordem: index + 1,
            })),
          descricao: obra.descricao.map(bloco),
          principaisServicos: obra.principaisServicos,
          resultadosDestaques: obra.resultadosDestaques,
          seo: {
            _type: "seo",
            metaTitulo: obra.titulo.slice(0, 58),
            metaDescricao: obra.resumo.slice(0, 158),
            observacoesSeo:
              "Origem: Portfólio.pdf. Agrupamento e etapas identificados visualmente; confirmar a associação das fotografias, cidade, área, prazo, ano, responsabilidade técnica e status.",
          },
          observacoesInternas:
            "Cadastro inicial com base em Portfólio.pdf. Identificação da obra, datas, localização, metragem e associação das fotos devem ser confirmadas. Não afirmar Steel Frame ou BlocoK apenas por análise visual.",
        };
        await client.createIfNotExists(documento);
        addLog(`${publicar ? "Publicada" : "Rascunho criado"}: ${obra.titulo}`);
      }
      addLog("Importação encerrada. Abra Serviços e Portfólio → Obras para editar os registros.");
    } catch (error) {
      addLog(`Importação interrompida: ${error instanceof Error ? error.message : String(error)}`);
      addLog("Os cadastros criados anteriormente foram preservados. Você pode tentar novamente sem duplicar as obras.");
    } finally {
      setImportando(false);
    }
  }

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: "32px 22px", color: "#193451" }}>
      <h1 style={{ fontSize: 30, fontWeight: 700 }}>Importar portfólio de obras</h1>
      <p style={{ lineHeight: 1.7, marginTop: 12 }}>
        Importe as fotos originais extraídas do portfólio da BEZEL e crie obras totalmente
        editáveis no Sanity. Confira cada grupo de fotografias antes de publicar:
        as identificações foram inferidas pela ordem das imagens no PDF.
      </p>
      <div style={{ background: "#F5F2ED", borderRadius: 12, padding: 20, marginTop: 24 }}>
        <label htmlFor="arquivo-portfolio" style={{ display: "block", fontWeight: 700, marginBottom: 10 }}>
          Selecione BEZEL_portfolio_importar_studio.json
        </label>
        <input
          id="arquivo-portfolio"
          type="file"
          accept=".json,application/json"
          disabled={importando}
          onChange={(event) => void selecionarArquivo(event.currentTarget.files?.[0])}
        />
        <p style={{ fontSize: 13, lineHeight: 1.5, marginTop: 10 }}>
          Este arquivo inclui as 12 fotos e as descrições. Não envia informações a serviços externos:
          o upload é feito do seu navegador diretamente para o Sanity autenticado.
        </p>
      </div>

      {pacote && (
        <>
          <h2 style={{ marginTop: 30, fontSize: 23, fontWeight: 700 }}>
            Prévia: {pacote.obras.length} obras
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
            {pacote.observacoes}
          </p>
          {pacote.obras.map((obra) => (
            <section
              key={obra._id}
              style={{ border: "1px solid #D9D5CE", borderRadius: 12, padding: 18, marginTop: 18 }}
            >
              <h3 style={{ fontSize: 19, fontWeight: 700 }}>{obra.titulo}</h3>
              <p style={{ marginTop: 8, lineHeight: 1.6 }}>{obra.resumo}</p>
              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
                  gap: 12,
                }}
              >
                {obra.fotos.map((foto) => (
                  <figure key={foto.id} style={{ margin: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/jpeg;base64,${foto.base64}`}
                      alt={foto.alt}
                      style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 8 }}
                    />
                    <figcaption style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                      PDF pág. {foto.pagina} · {foto.titulo}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 22, lineHeight: 1.6 }}>
            <input
              type="checkbox"
              checked={confirmado}
              disabled={importando}
              onChange={(event) => setConfirmado(event.currentTarget.checked)}
              style={{ marginTop: 6 }}
            />
            Confirmei que as fotos estão agrupadas corretamente. Entendo que os nomes são provisórios,
            e que localização, metragem, datas e status real das obras devem ser preenchidos depois.
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
            <button
              type="button"
              disabled={!confirmado || importando}
              onClick={() => void importar(false)}
              style={{ padding: "12px 20px", background: "#D9D5CE", color: "#193451", borderRadius: 24, opacity: !confirmado || importando ? 0.5 : 1 }}
            >
              Importar como rascunhos
            </button>
            <button
              type="button"
              disabled={!confirmado || importando}
              onClick={() => void importar(true)}
              style={{ padding: "12px 20px", background: "#C3A06A", color: "#193451", borderRadius: 24, fontWeight: 700, opacity: !confirmado || importando ? 0.5 : 1 }}
            >
              {importando ? "Importando fotos e obras..." : "Importar e publicar no site"}
            </button>
          </div>
        </>
      )}
      {mensagens.length > 0 && (
        <section aria-live="polite" style={{ marginTop: 24, background: "#F5F2ED", borderRadius: 10, padding: 18 }}>
          {mensagens.map((mensagem, index) => (
            <p key={index} style={{ margin: "8px 0", fontSize: 14, lineHeight: 1.5 }}>{mensagem}</p>
          ))}
        </section>
      )}
    </main>
  );
}
