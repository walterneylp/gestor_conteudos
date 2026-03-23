import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const jobOriginEnum = pgEnum("job_origin", ["research", "article", "webhook"]);
export const jobStatusEnum = pgEnum("job_status", [
  "draft",
  "processing",
  "awaiting_approval",
  "approved",
  "rejected",
  "expired",
  "published",
  "failed",
]);
export const channelEnum = pgEnum("social_channel", ["linkedin", "instagram", "x", "facebook"]);
export const approvalDecisionEnum = pgEnum("approval_decision", [
  "pending",
  "approved",
  "rejected",
  "needs_changes",
  "approved_with_comment",
]);
export const approvalFlowStatusEnum = pgEnum("approval_flow_status", [
  "pending",
  "approved",
  "rejected",
  "expired",
]);
export const sourceTypeEnum = pgEnum("source_type", ["topic", "article", "url", "webhook"]);
export const variantStatusEnum = pgEnum("variant_status", ["draft", "ready", "approved"]);
export const creativeTypeEnum = pgEnum("creative_type", ["image", "carousel"]);
export const approvalPolicyEnum = pgEnum("approval_policy", [
  "dashboard_review",
  "manual_decision",
  "return_to_edit",
]);
export const approverLevelEnum = pgEnum("approver_level", ["content", "brand", "final"]);

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workspaceSettings = pgTable("workspace_settings", {
  workspaceId: text("workspace_id")
    .primaryKey()
    .references(() => workspaces.id),
  workspaceName: text("workspace_name").notNull(),
  branding: jsonb("branding")
    .$type<{
      tone: string;
      primaryColor: string;
      secondaryColor: string;
      defaultCta: string;
    }>()
    .notNull(),
  approval: jsonb("approval")
    .$type<{
      slaHours: number;
      defaultExpiryPolicy: "dashboard_review" | "manual_decision" | "return_to_edit";
    }>()
    .notNull(),
  searchRouting: jsonb("search_routing")
    .$type<{ primary: string; fallback: string }>()
    .notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentJobs = pgTable("content_jobs", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  origin: jobOriginEnum("origin").notNull(),
  status: jobStatusEnum("status").notNull(),
  objective: text("objective").notNull(),
  audience: text("audience").notNull(),
  language: text("language").notNull(),
  tone: text("tone").notNull(),
  depth: text("depth").notNull(),
  desiredLength: text("desired_length").notNull(),
  sourceSummary: text("source_summary").notNull(),
  selectedChannels: jsonb("selected_channels").$type<string[]>().notNull(),
  ownerName: text("owner_name").notNull(),
  dueAt: timestamp("due_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sources = pgTable("sources", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .references(() => contentJobs.id)
    .notNull(),
  type: sourceTypeEnum("type").notNull(),
  title: text("title").notNull(),
  value: text("value").notNull(),
  normalizedText: text("normalized_text").notNull(),
  references: jsonb("references")
    .$type<Array<{ label: string; url: string; trustScore: number }>>()
    .notNull(),
});

export const masterArticles = pgTable("master_articles", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .references(() => contentJobs.id)
    .notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  cta: text("cta").notNull(),
  references: jsonb("references").$type<string[]>().notNull(),
  editorialNotes: text("editorial_notes").notNull(),
  version: integer("version").default(1).notNull(),
});

export const socialVariants = pgTable("social_variants", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .references(() => contentJobs.id)
    .notNull(),
  channel: channelEnum("channel").notNull(),
  headline: text("headline").notNull(),
  body: text("body").notNull(),
  cta: text("cta").notNull(),
  hashtags: jsonb("hashtags").$type<string[]>().notNull(),
  status: variantStatusEnum("status").notNull(),
});

export const creativeAssets = pgTable("creative_assets", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .references(() => contentJobs.id)
    .notNull(),
  channel: channelEnum("channel").notNull(),
  type: creativeTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dimensions: text("dimensions").notNull(),
  status: text("status").notNull(),
});

export const approvers = pgTable("approvers", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  order: integer("order_index").notNull(),
  required: boolean("required").default(true).notNull(),
  level: approverLevelEnum("level").notNull(),
  active: boolean("active").default(true).notNull(),
});

export const approvalFlows = pgTable("approval_flows", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .references(() => contentJobs.id)
    .notNull(),
  status: approvalFlowStatusEnum("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  policyAfterExpiry: approvalPolicyEnum("policy_after_expiry").notNull(),
  approverIds: jsonb("approver_ids").$type<string[]>().notNull(),
});

export const approvalActions = pgTable("approval_actions", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .references(() => contentJobs.id)
    .notNull(),
  approverEmail: text("approver_email").notNull(),
  decision: approvalDecisionEnum("decision").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const integrationEndpoints = pgTable("integration_endpoints", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  timeoutMs: integer("timeout_ms").default(8000).notNull(),
  retries: integer("retries").default(3).notNull(),
  secretConfigured: boolean("secret_configured").default(false).notNull(),
});

export const apiProviders = pgTable("api_providers", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id),
  domain: text("domain").notNull(),
  providerKey: text("provider_key"),
  name: text("name").notNull(),
  strategy: text("strategy").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  priority: integer("priority"),
  selectedModel: text("selected_model"),
  availableModels: jsonb("available_models").$type<Array<{ id: string; label: string }>>(),
  secretConfigured: boolean("secret_configured").default(false).notNull(),
  endpoint: text("endpoint"),
  notes: text("notes").notNull(),
  discoveredAt: timestamp("discovered_at"),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  event: text("event").notNull(),
  jobId: text("job_id"),
  actor: text("actor").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
