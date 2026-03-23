export type JobOrigin = "research" | "article" | "webhook";
export type JobStatus =
  | "draft"
  | "processing"
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "expired"
  | "published"
  | "failed";
export type SocialChannel = "linkedin" | "instagram" | "x" | "facebook";
export type VariantStatus = "draft" | "ready" | "approved";
export type CreativeType = "image" | "carousel";
export type SearchProviderKey = "brave" | "serper";
export type LlmProviderKey =
  | "openai"
  | "groq"
  | "openrouter"
  | "anthropic"
  | "gemini";
export type ApprovalDecision =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_changes"
  | "approved_with_comment";

export type ContentJob = {
  id: string;
  title: string;
  slug: string;
  origin: JobOrigin;
  status: JobStatus;
  objective: string;
  audience: string;
  language: string;
  tone: string;
  depth: string;
  desiredLength: string;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  sourceSummary: string;
  selectedChannels: SocialChannel[];
  ownerName: string;
};

export type SourceRecord = {
  id: string;
  jobId: string;
  type: "topic" | "article" | "url" | "webhook";
  title: string;
  value: string;
  normalizedText: string;
  references: Array<{ label: string; url: string; trustScore: number }>;
};

export type MasterArticle = {
  id: string;
  jobId: string;
  title: string;
  subtitle: string;
  summary: string;
  body: string;
  cta: string;
  references: string[];
  editorialNotes: string;
  version: number;
};

export type SocialVariant = {
  id: string;
  jobId: string;
  channel: SocialChannel;
  headline: string;
  body: string;
  cta: string;
  hashtags: string[];
  status: VariantStatus;
};

export type CreativeAsset = {
  id: string;
  jobId: string;
  channel: SocialChannel;
  type: CreativeType;
  title: string;
  description: string;
  dimensions: string;
  status: "mock_ready" | "pending";
};

export type Approver = {
  id: string;
  name: string;
  email: string;
  order: number;
  required: boolean;
  level: "content" | "brand" | "final";
  active: boolean;
};

export type ApprovalAction = {
  id: string;
  jobId: string;
  approverEmail: string;
  decision: ApprovalDecision;
  comment: string;
  createdAt: string;
};

export type ApprovalFlow = {
  id: string;
  jobId: string;
  status: "pending" | "approved" | "rejected" | "expired";
  expiresAt: string;
  policyAfterExpiry: "dashboard_review" | "manual_decision" | "return_to_edit";
  approverIds: string[];
};

export type IntegrationEndpoint = {
  id: string;
  kind: "n8n_outbound" | "n8n_inbound" | "external_inbound";
  name: string;
  url: string;
  enabled: boolean;
  timeoutMs: number;
  retries: number;
  secretConfigured: boolean;
};

export type ApiProvider = {
  id: string;
  domain: "search" | "text" | "image" | "delivery";
  providerKey?: SearchProviderKey | LlmProviderKey | "n8n";
  name: string;
  strategy: "primary" | "fallback" | "cost_optimized";
  enabled: boolean;
  notes: string;
  priority?: number;
  selectedModel?: string;
  availableModels?: ModelOption[];
  secretConfigured?: boolean;
  endpoint?: string;
  discoveredAt?: string;
};

export type ModelOption = {
  id: string;
  label: string;
  contextWindow?: number;
  modalities?: string[];
};

export type AuditLog = {
  id: string;
  event: string;
  jobId?: string;
  actor: string;
  details: string;
  createdAt: string;
};

export type WorkspaceSettings = {
  workspaceName: string;
  branding: {
    tone: string;
    primaryColor: string;
    secondaryColor: string;
    defaultCta: string;
  };
  approval: {
    slaHours: number;
    defaultExpiryPolicy: ApprovalFlow["policyAfterExpiry"];
  };
  searchRouting: {
    primary: SearchProviderKey;
    fallback: SearchProviderKey;
  };
};

export type StoreData = {
  jobs: ContentJob[];
  sources: SourceRecord[];
  masterArticles: MasterArticle[];
  socialVariants: SocialVariant[];
  creativeAssets: CreativeAsset[];
  approvers: Approver[];
  approvalFlows: ApprovalFlow[];
  approvalActions: ApprovalAction[];
  integrationEndpoints: IntegrationEndpoint[];
  apiProviders: ApiProvider[];
  auditLogs: AuditLog[];
  settings: WorkspaceSettings;
};

export type JobDetail = {
  job: ContentJob;
  source?: SourceRecord;
  masterArticle?: MasterArticle;
  variants: SocialVariant[];
  creativeAssets: CreativeAsset[];
  approvalFlow?: ApprovalFlow;
  approvalActions: ApprovalAction[];
  approvers: Approver[];
};

export type DashboardSummary = {
  totalJobs: number;
  awaitingApproval: number;
  approved: number;
  failed: number;
  jobsByStatus: Array<{ label: string; value: number }>;
};

export type CreateJobInput = {
  origin: JobOrigin;
  title: string;
  objective: string;
  audience: string;
  language: string;
  tone: string;
  depth: string;
  desiredLength: string;
  sourceSummary: string;
  rawArticle?: string;
  sourceUrl?: string;
  selectedChannels: SocialChannel[];
};

export type SettingsSnapshot = {
  settings: WorkspaceSettings;
  providers: ApiProvider[];
  searchProviders: ApiProvider[];
  llmProviders: ApiProvider[];
  endpoints: IntegrationEndpoint[];
  approvers: Approver[];
  databaseConfigured: boolean;
  supabasePublicConfigured: boolean;
  supabaseUrl?: string;
};
