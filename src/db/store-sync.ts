import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type postgres from "postgres";
import {
  apiProviders,
  approvalActions,
  approvalFlows,
  approvers,
  auditLogs,
  contentJobs,
  creativeAssets,
  integrationEndpoints,
  masterArticles,
  socialVariants,
  sources,
  workspaceSettings,
  workspaces,
} from "@/db/schema";
import type { StoreData } from "@/lib/types";

const WORKSPACE_ID = "workspace_default";

type Db = PostgresJsDatabase<Record<string, never>> & {
  $client?: ReturnType<typeof postgres>;
};

const wipeWorkspace = async (db: Db) => {
  await db.delete(approvalActions);
  await db.delete(approvalFlows);
  await db.delete(creativeAssets);
  await db.delete(socialVariants);
  await db.delete(masterArticles);
  await db.delete(sources);
  await db.delete(contentJobs);
  await db.delete(approvers);
  await db.delete(integrationEndpoints);
  await db.delete(apiProviders);
  await db.delete(auditLogs);
  await db.delete(workspaceSettings);
  await db.delete(workspaces).where(eq(workspaces.id, WORKSPACE_ID));
};

export const syncStoreDataToDatabase = async (db: Db, store: StoreData) => {
  await db.transaction(async (tx) => {
    await wipeWorkspace(tx as Db);

    await tx.insert(workspaces).values({
      id: WORKSPACE_ID,
      name: store.settings.workspaceName,
    });

    await tx.insert(workspaceSettings).values({
      workspaceId: WORKSPACE_ID,
      workspaceName: store.settings.workspaceName,
      branding: store.settings.branding,
      approval: store.settings.approval,
      searchRouting: store.settings.searchRouting,
      updatedAt: new Date(),
    });

    if (store.approvers.length > 0) {
      await tx.insert(approvers).values(
        store.approvers.map((approver) => ({
          ...approver,
          workspaceId: WORKSPACE_ID,
          order: approver.order,
        })),
      );
    }

    if (store.integrationEndpoints.length > 0) {
      await tx.insert(integrationEndpoints).values(
        store.integrationEndpoints.map((endpoint) => ({
          ...endpoint,
          workspaceId: WORKSPACE_ID,
        })),
      );
    }

    if (store.apiProviders.length > 0) {
      await tx.insert(apiProviders).values(
        store.apiProviders.map((provider) => ({
          ...provider,
          workspaceId: WORKSPACE_ID,
          availableModels: provider.availableModels,
          discoveredAt: provider.discoveredAt ? new Date(provider.discoveredAt) : null,
        })),
      );
    }

    if (store.jobs.length > 0) {
      await tx.insert(contentJobs).values(
        store.jobs.map((job) => ({
          ...job,
          workspaceId: WORKSPACE_ID,
          dueAt: new Date(job.dueAt),
          createdAt: new Date(job.createdAt),
          updatedAt: new Date(job.updatedAt),
        })),
      );
    }

    if (store.sources.length > 0) {
      await tx.insert(sources).values(store.sources);
    }

    if (store.masterArticles.length > 0) {
      await tx.insert(masterArticles).values(store.masterArticles);
    }

    if (store.socialVariants.length > 0) {
      await tx.insert(socialVariants).values(store.socialVariants);
    }

    if (store.creativeAssets.length > 0) {
      await tx.insert(creativeAssets).values(store.creativeAssets);
    }

    if (store.approvalFlows.length > 0) {
      await tx.insert(approvalFlows).values(
        store.approvalFlows.map((flow) => ({
          ...flow,
          expiresAt: new Date(flow.expiresAt),
        })),
      );
    }

    if (store.approvalActions.length > 0) {
      await tx.insert(approvalActions).values(
        store.approvalActions.map((action) => ({
          ...action,
          createdAt: new Date(action.createdAt),
        })),
      );
    }

    if (store.auditLogs.length > 0) {
      await tx.insert(auditLogs).values(
        store.auditLogs.map((log) => ({
          ...log,
          createdAt: new Date(log.createdAt),
        })),
      );
    }
  });
};
