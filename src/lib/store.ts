import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { buildCreativeDescriptions, buildMasterArticle, buildVariants } from "@/lib/content";
import { env, isDatabaseConfigured } from "@/lib/env";
import { generateId, slugify } from "@/lib/utils";
import type {
  ApprovalAction,
  ApprovalFlow,
  Approver,
  AuditLog,
  ContentJob,
  CreateJobInput,
  CreativeAsset,
  DashboardSummary,
  JobDetail,
  SourceRecord,
  StoreData,
} from "@/lib/types";

const now = () => new Date().toISOString();
const dayFromNow = () => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
const STORE_PATH = path.join(process.cwd(), ".data", "store.json");

const defaultApprovers: Approver[] = [
  {
    id: "approver_brand",
    name: "Marina Brand",
    email: "marina@workspace.local",
    order: 1,
    required: true,
    level: "brand",
    active: true,
  },
  {
    id: "approver_final",
    name: "Carlos Final",
    email: "carlos@workspace.local",
    order: 2,
    required: true,
    level: "final",
    active: true,
  },
];

const createDemoStore = (): StoreData => {
  const createdAt = now();
  const jobs: ContentJob[] = [
    {
      id: "job_demo_research",
      title: "IA aplicada a operacoes de marketing",
      slug: "ia-aplicada-a-operacoes-de-marketing",
      origin: "research",
      status: "awaiting_approval",
      objective: "Gerar autoridade e pipeline organico",
      audience: "CMOs e liderancas de growth",
      language: "pt-BR",
      tone: "Consultivo e objetivo",
      depth: "Analitico",
      desiredLength: "1.200 palavras",
      createdAt,
      updatedAt: createdAt,
      dueAt: dayFromNow(),
      sourceSummary:
        "Pesquisa consolidada sobre automacao editorial, governanca de IA e distribuicao multicanal.",
      selectedChannels: ["linkedin", "instagram", "x", "facebook"],
      ownerName: "Walterney",
    },
    {
      id: "job_demo_article",
      title: "Como transformar um artigo em uma operacao multicanal",
      slug: "como-transformar-um-artigo-em-uma-operacao-multicanal",
      origin: "article",
      status: "approved",
      objective: "Reaproveitar artigo base e acelerar producao",
      audience: "Times editoriais e de conteudo",
      language: "pt-BR",
      tone: "Didatico e pragmatico",
      depth: "Tatico",
      desiredLength: "900 palavras",
      createdAt,
      updatedAt: createdAt,
      dueAt: dayFromNow(),
      sourceSummary:
        "Artigo pronto foi reestruturado em artigo-mestre, variantes e criativos para redes sociais.",
      selectedChannels: ["linkedin", "instagram"],
      ownerName: "Walterney",
    },
  ];

  const sources: SourceRecord[] = jobs.map((job) => ({
    id: `source_${job.id}`,
    jobId: job.id,
    type: job.origin === "research" ? "topic" : "article",
    title: job.title,
    value: job.sourceSummary,
    normalizedText: job.sourceSummary,
    references:
      job.origin === "research"
        ? [
            { label: "Relatorio de mercado", url: "https://example.com/mercado", trustScore: 91 },
            { label: "Benchmark editorial", url: "https://example.com/benchmark", trustScore: 88 },
          ]
        : [{ label: "Documento enviado", url: "manual://article-upload", trustScore: 100 }],
  }));

  const masterArticles = jobs.map((job) => ({
    id: `master_${job.id}`,
    jobId: job.id,
    ...buildMasterArticle({
      origin: job.origin,
      title: job.title,
      objective: job.objective,
      audience: job.audience,
      language: job.language,
      tone: job.tone,
      depth: job.depth,
      desiredLength: job.desiredLength,
      sourceSummary: job.sourceSummary,
      selectedChannels: job.selectedChannels,
    }),
    version: 1,
  }));

  const socialVariants = jobs.flatMap((job) =>
    buildVariants(job.id, {
      origin: job.origin,
      title: job.title,
      objective: job.objective,
      audience: job.audience,
      language: job.language,
      tone: job.tone,
      depth: job.depth,
      desiredLength: job.desiredLength,
      sourceSummary: job.sourceSummary,
      selectedChannels: job.selectedChannels,
    }),
  );

  const creativeAssets: CreativeAsset[] = jobs.flatMap((job) =>
    job.selectedChannels.flatMap((channel) => {
      const descriptions = buildCreativeDescriptions(job.title, channel);

      return [
        {
          id: `${job.id}_${channel}_image`,
          jobId: job.id,
          channel,
          type: "image",
          title: `Imagem ${channel}`,
          description: descriptions.image,
          dimensions: channel === "instagram" ? "1080x1350" : "1200x675",
          status: "mock_ready",
        },
        {
          id: `${job.id}_${channel}_carousel`,
          jobId: job.id,
          channel,
          type: "carousel",
          title: `Carrossel ${channel}`,
          description: descriptions.carousel,
          dimensions: "1080x1350",
          status: "mock_ready",
        },
      ];
    }),
  );

  const approvalFlows: ApprovalFlow[] = jobs.map((job) => ({
    id: `approval_${job.id}`,
    jobId: job.id,
    status: job.status === "approved" ? "approved" : "pending",
    expiresAt: dayFromNow(),
    policyAfterExpiry: "dashboard_review",
    approverIds: defaultApprovers.map((approver) => approver.id),
  }));

  const approvalActions: ApprovalAction[] = [
    {
      id: "approval_action_demo",
      jobId: "job_demo_article",
      approverEmail: "carlos@workspace.local",
      decision: "approved_with_comment",
      comment: "Aprovado para seguir ao dashboard final.",
      createdAt,
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "audit_1",
      event: "job.created",
      jobId: "job_demo_research",
      actor: "system",
      details: "Job de pesquisa criado no workspace demo.",
      createdAt,
    },
    {
      id: "audit_2",
      event: "approval.received",
      jobId: "job_demo_article",
      actor: "n8n-callback",
      details: "Retorno de aprovacao recebido e consolidado.",
      createdAt,
    },
  ];

  return {
    jobs,
    sources,
    masterArticles,
    socialVariants,
    creativeAssets,
    approvers: defaultApprovers,
    approvalFlows,
    approvalActions,
    integrationEndpoints: [
      {
        id: "integration_n8n_out",
        kind: "n8n_outbound",
        name: "n8n envio aprovacao",
        url: "https://n8n.example.com/webhook/send-approval",
        enabled: true,
        timeoutMs: 8000,
        retries: 3,
        secretConfigured: Boolean(env.n8nOutboundSecret),
      },
      {
        id: "integration_n8n_in",
        kind: "n8n_inbound",
        name: "n8n retorno aprovacao",
        url: "https://app.local/api/webhooks/n8n/inbound",
        enabled: true,
        timeoutMs: 8000,
        retries: 3,
        secretConfigured: Boolean(env.n8nInboundSecret),
      },
    ],
    apiProviders: [
      { id: "api_search_1", domain: "search", name: "Brave Search", strategy: "primary", enabled: true, notes: "Pesquisa primaria" },
      { id: "api_text_1", domain: "text", name: "LLM Editorial A", strategy: "primary", enabled: true, notes: "Geracao do artigo-mestre" },
      { id: "api_text_2", domain: "text", name: "LLM Editorial B", strategy: "fallback", enabled: true, notes: "Fallback para adaptacoes" },
      { id: "api_image_1", domain: "image", name: "Image Provider", strategy: "cost_optimized", enabled: true, notes: "Criativos still image e carousel" },
      { id: "api_delivery_1", domain: "delivery", name: "n8n Cloud", strategy: "primary", enabled: true, notes: "Entrega operacional" },
    ],
    auditLogs,
    settings: {
      workspaceName: "Gestor de Conteudos",
      branding: {
        tone: "Especialista, confiavel e direto",
        primaryColor: "#b75d2a",
        secondaryColor: "#102a43",
        defaultCta: "Fale com o time para transformar este tema em pipeline.",
      },
      approval: {
        slaHours: 24,
        defaultExpiryPolicy: "dashboard_review",
      },
    },
  };
};

const ensureStore = async () => {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });

  try {
    const content = await readFile(STORE_PATH, "utf8");
    return JSON.parse(content) as StoreData;
  } catch {
    const seeded = createDemoStore();
    await writeFile(STORE_PATH, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
};

const saveStore = async (store: StoreData) => {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
};

const addAuditLog = (store: StoreData, event: string, actor: string, details: string, jobId?: string) => {
  store.auditLogs.unshift({
    id: generateId("audit"),
    event,
    actor,
    details,
    jobId,
    createdAt: now(),
  });
};

export const listJobs = async () => {
  const store = await ensureStore();
  return store.jobs.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const jobs = await listJobs();
  const count = (status: ContentJob["status"]) => jobs.filter((job) => job.status === status).length;

  return {
    totalJobs: jobs.length,
    awaitingApproval: count("awaiting_approval"),
    approved: count("approved"),
    failed: count("failed"),
    jobsByStatus: [
      { label: "Rascunhos", value: count("draft") },
      { label: "Aguardando aprovacao", value: count("awaiting_approval") },
      { label: "Aprovados", value: count("approved") },
      { label: "Falhas", value: count("failed") },
    ],
  };
};

export const getJobDetail = async (jobId: string): Promise<JobDetail | undefined> => {
  const store = await ensureStore();
  const job = store.jobs.find((entry) => entry.id === jobId);

  if (!job) {
    return undefined;
  }

  const approvalFlow = store.approvalFlows.find((entry) => entry.jobId === jobId);
  const approvers = approvalFlow
    ? store.approvers.filter((approver) => approvalFlow.approverIds.includes(approver.id))
    : [];

  return {
    job,
    source: store.sources.find((entry) => entry.jobId === jobId),
    masterArticle: store.masterArticles.find((entry) => entry.jobId === jobId),
    variants: store.socialVariants.filter((entry) => entry.jobId === jobId),
    creativeAssets: store.creativeAssets.filter((entry) => entry.jobId === jobId),
    approvalFlow,
    approvalActions: store.approvalActions.filter((entry) => entry.jobId === jobId),
    approvers,
  };
};

export const listApprovalQueue = async () => {
  const store = await ensureStore();

  return store.approvalFlows
    .map((flow) => ({
      flow,
      job: store.jobs.find((job) => job.id === flow.jobId),
      approvers: store.approvers.filter((approver) => flow.approverIds.includes(approver.id)),
    }))
    .filter((entry) => entry.job)
    .sort((left, right) => left.flow.expiresAt.localeCompare(right.flow.expiresAt));
};

export const listAuditLogs = async () => {
  const store = await ensureStore();
  return store.auditLogs.slice(0, 20);
};

export const getSettingsSnapshot = async () => {
  const store = await ensureStore();

  return {
    settings: store.settings,
    providers: store.apiProviders,
    endpoints: store.integrationEndpoints,
    approvers: store.approvers,
    databaseConfigured: isDatabaseConfigured(),
  };
};

export const createJob = async (input: CreateJobInput) => {
  const store = await ensureStore();
  const createdAt = now();
  const jobId = generateId("job");
  const slug = slugify(input.title);
  const master = buildMasterArticle(input);
  const variants = buildVariants(jobId, input);

  const job: ContentJob = {
    id: jobId,
    title: input.title,
    slug,
    origin: input.origin,
    status: "awaiting_approval",
    objective: input.objective,
    audience: input.audience,
    language: input.language,
    tone: input.tone,
    depth: input.depth,
    desiredLength: input.desiredLength,
    createdAt,
    updatedAt: createdAt,
    dueAt: dayFromNow(),
    sourceSummary: input.sourceSummary,
    selectedChannels: input.selectedChannels,
    ownerName: "Workspace Local",
  };

  const source: SourceRecord = {
    id: generateId("source"),
    jobId,
    type:
      input.origin === "research"
        ? "topic"
        : input.origin === "webhook"
          ? "webhook"
          : input.sourceUrl
            ? "url"
            : "article",
    title: input.title,
    value: input.rawArticle || input.sourceSummary,
    normalizedText: input.rawArticle || input.sourceSummary,
    references: input.sourceUrl
      ? [{ label: "Fonte informada", url: input.sourceUrl, trustScore: 83 }]
      : [{ label: "Briefing inicial", url: "manual://intake", trustScore: 100 }],
  };

  const creativeAssets: CreativeAsset[] = input.selectedChannels.flatMap((channel) => {
    const descriptions = buildCreativeDescriptions(input.title, channel);

    return [
      {
        id: generateId("creative"),
        jobId,
        channel,
        type: "image",
        title: `${channel} image`,
        description: descriptions.image,
        dimensions: channel === "instagram" ? "1080x1350" : "1200x675",
        status: "mock_ready",
      },
      {
        id: generateId("creative"),
        jobId,
        channel,
        type: "carousel",
        title: `${channel} carousel`,
        description: descriptions.carousel,
        dimensions: "1080x1350",
        status: "mock_ready",
      },
    ];
  });

  const flow: ApprovalFlow = {
    id: generateId("approval"),
    jobId,
    status: "pending",
    expiresAt: dayFromNow(),
    policyAfterExpiry: store.settings.approval.defaultExpiryPolicy,
    approverIds: store.approvers.slice(0, 2).map((approver) => approver.id),
  };

  store.jobs.unshift(job);
  store.sources.unshift(source);
  store.masterArticles.unshift({ id: generateId("master"), jobId, ...master, version: 1 });
  store.socialVariants.unshift(...variants);
  store.creativeAssets.unshift(...creativeAssets);
  store.approvalFlows.unshift(flow);
  addAuditLog(store, "job.created", "editor-ui", "Novo job criado pelo intake inicial.", jobId);
  addAuditLog(
    store,
    "integration.pending",
    "system",
    "Pacote pronto para envio ao n8n assim que endpoint e segredo forem configurados.",
    jobId,
  );

  await saveStore(store);

  return job;
};

export const applyApprovalDecision = async ({
  jobId,
  approverEmail,
  decision,
  comment,
}: {
  jobId: string;
  approverEmail: string;
  decision: ApprovalAction["decision"];
  comment: string;
}) => {
  const store = await ensureStore();
  const flow = store.approvalFlows.find((entry) => entry.jobId === jobId);
  const job = store.jobs.find((entry) => entry.id === jobId);

  if (!flow || !job) {
    return false;
  }

  store.approvalActions.unshift({
    id: generateId("approval_action"),
    jobId,
    approverEmail,
    decision,
    comment,
    createdAt: now(),
  });

  if (decision === "approved" || decision === "approved_with_comment") {
    flow.status = "approved";
    job.status = "approved";
  }

  if (decision === "rejected" || decision === "needs_changes") {
    flow.status = "rejected";
    job.status = "rejected";
  }

  job.updatedAt = now();
  addAuditLog(store, "approval.callback", approverEmail, `Decisao recebida: ${decision}. ${comment}`, jobId);
  await saveStore(store);

  return true;
};

export const createJobFromWebhook = async (
  input: CreateJobInput & { externalId?: string },
) => {
  const job = await createJob({ ...input, origin: "webhook" });
  const store = await ensureStore();
  addAuditLog(
    store,
    "webhook.external.received",
    "external-system",
    `Webhook externo convertido em job. ID externo: ${input.externalId || "n/a"}.`,
    job.id,
  );
  await saveStore(store);
  return job;
};

export const getDeliveryPayload = async (jobId: string) => {
  const detail = await getJobDetail(jobId);

  if (!detail) {
    return undefined;
  }

  return {
    jobId: detail.job.id,
    title: detail.job.title,
    status: detail.job.status,
    masterArticle: detail.masterArticle,
    variants: detail.variants,
    creativeAssets: detail.creativeAssets,
    approvalFlow: detail.approvalFlow,
    approvers: detail.approvers,
  };
};
