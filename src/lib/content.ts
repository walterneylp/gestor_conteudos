import type { CreateJobInput, SocialChannel, SocialVariant } from "@/lib/types";
import { socialLabels } from "@/lib/navigation";

const variantOpeners: Record<SocialChannel, string> = {
  linkedin: "Abrindo a conversa com recorte estrategico e credibilidade:",
  instagram: "Transformando o tema em uma narrativa visual e direta:",
  x: "Versao curta com gancho forte e valor imediato:",
  facebook: "Contextualizacao leve para alcance organico e compartilhamento:",
};

export const buildMasterArticle = (input: CreateJobInput) => {
  const intro =
    input.origin === "research"
      ? `Este job nasceu de uma pesquisa orientada por objetivo: ${input.objective}.`
      : "Este job foi iniciado a partir de um artigo pronto que precisa ser aproveitado com governanca editorial.";

  return {
    title: input.title,
    subtitle: `Roteiro central para ${input.audience.toLowerCase()} em ${input.language}`,
    summary: `${intro} O texto principal organiza argumentos, referencias e CTA para alimentar todas as redes sociais sem perder coerencia.`,
    body: [
      "1. Contexto",
      intro,
      "",
      "2. Oportunidade editorial",
      `Tom definido: ${input.tone}. Profundidade desejada: ${input.depth}. Tamanho alvo: ${input.desiredLength}.`,
      "",
      "3. Estrutura recomendada",
      "Apresente o problema, reforce porque ele importa agora, entregue pontos praticos e encerre com CTA claro.",
      "",
      "4. Proximos passos",
      "Validar referencias, revisar branding, ajustar variantes por canal e enviar para aprovacao.",
    ].join("\n"),
    cta: "Validar artigo-mestre e liberar adaptacoes por canal.",
    editorialNotes: `Resumo da origem: ${input.sourceSummary}`,
    references:
      input.origin === "research"
        ? [
            "https://example.com/fonte-primaria",
            "https://example.com/analise-setorial",
            "https://example.com/caso-pratico",
          ]
        : [input.sourceUrl || "Artigo enviado diretamente pelo usuario"],
  };
};

export const buildVariants = (jobId: string, input: CreateJobInput): SocialVariant[] =>
  input.selectedChannels.map((channel) => ({
    id: `${jobId}_${channel}`,
    jobId,
    channel,
    headline: `${socialLabels[channel]} | ${input.title}`,
    body: `${variantOpeners[channel]} ${input.sourceSummary} Direcione a audiencia para o proximo passo com foco em ${input.objective.toLowerCase()}.`,
    cta:
      channel === "instagram"
        ? "Salve este conteudo e envie para o time."
        : channel === "x"
          ? "Responda com sua leitura do tema."
          : "Comente ou compartilhe com quem decide esse tema.",
    hashtags: ["#conteudo", "#editorial", `#${channel}`],
    status: "ready",
  }));

export const buildCreativeDescriptions = (title: string, channel: SocialChannel) => {
  if (channel === "instagram") {
    return {
      image: "Arte para feed com headline curta, area segura e CTA de engajamento.",
      carousel: "Carrossel em 6 slides: capa, contexto, pontos-chave, exemplo, conclusao e CTA.",
    };
  }

  if (channel === "linkedin") {
    return {
      image: "Thumb institucional com framing horizontal e argumento central.",
      carousel: "Documento visual para liderancas com tese, contexto, framework e CTA final.",
    };
  }

  if (channel === "x") {
    return {
      image: "Card com frase de impacto e reforco visual minimalista.",
      carousel: "Sequencia de cards para thread visual com numeracao curta.",
    };
  }

  return {
    image: `Criativo de feed para ${title} com copy direta e branding.`,
    carousel: "Carrossel com dor, contexto, prova e CTA de compartilhamento.",
  };
};
