import { getSupabaseServerClient } from "@/lib/supabase/client";
import type { StoreData } from "@/lib/types";

export const SUPABASE_WORKSPACE_STATE_TABLE = "workspace_state";
export const SUPABASE_WORKSPACE_STATE_ID = "workspace_default";

type WorkspaceStateRow = {
  id: string;
  payload: StoreData;
  updated_at?: string;
};

type WorkspaceStateReadChain = {
  eq: (
    column: string,
    value: string,
  ) => {
    maybeSingle: () => Promise<{ data: WorkspaceStateRow | null; error: unknown }>;
  };
};

type WorkspaceStateTable = {
  select: (columns: string) => WorkspaceStateReadChain;
  upsert: (
    value: {
      id: string;
      payload: StoreData;
      updated_at: string;
    },
    options: { onConflict: string },
  ) => Promise<{ error: unknown }>;
};

const isMissingRelationError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "42P01";

const getErrorMessage = (error: unknown) =>
  typeof error === "object" && error !== null && "message" in error
    ? String(error.message)
    : "erro desconhecido";

export const readSupabaseStore = async (): Promise<StoreData | undefined> => {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return undefined;
  }

  const workspaceStateTable = supabase.from(
    SUPABASE_WORKSPACE_STATE_TABLE as never,
  ) as unknown as WorkspaceStateTable;

  const response = await workspaceStateTable
    .select("id, payload, updated_at")
    .eq("id", SUPABASE_WORKSPACE_STATE_ID)
    .maybeSingle();
  const { data, error } = response;

  if (error) {
    if (isMissingRelationError(error)) {
      return undefined;
    }

    throw new Error(`Falha ao ler workspace_state no Supabase: ${getErrorMessage(error)}`);
  }

  return data?.payload;
};

export const writeSupabaseStore = async (store: StoreData) => {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return false;
  }

  const workspaceStateTable = supabase.from(
    SUPABASE_WORKSPACE_STATE_TABLE as never,
  ) as unknown as WorkspaceStateTable;

  const { error } = await workspaceStateTable.upsert(
    {
      id: SUPABASE_WORKSPACE_STATE_ID,
      payload: store,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    return false;
  }

  return true;
};
