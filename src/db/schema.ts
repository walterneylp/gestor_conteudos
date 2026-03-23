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

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  status: text("status").notNull(),
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
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  timeoutMs: integer("timeout_ms").default(8000).notNull(),
  retries: integer("retries").default(3).notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  event: text("event").notNull(),
  jobId: text("job_id"),
  actor: text("actor").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
