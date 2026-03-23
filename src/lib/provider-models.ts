import type { LlmProviderKey, ModelOption } from "@/lib/types";

type DiscoveryArgs = {
  providerKey: LlmProviderKey;
  apiKey: string;
};

const normalize = (value: string) => value.trim();

const sortModels = (models: ModelOption[]) =>
  [...models].sort((left, right) => left.label.localeCompare(right.label));

export const discoverProviderModels = async ({
  providerKey,
  apiKey,
}: DiscoveryArgs): Promise<ModelOption[]> => {
  const token = normalize(apiKey);

  if (!token) {
    throw new Error("API key obrigatoria para descobrir modelos.");
  }

  if (providerKey === "openai") {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`OpenAI retornou ${response.status}.`);
    }

    const payload = (await response.json()) as { data?: Array<{ id: string }> };
    return sortModels(
      (payload.data || [])
        .map((item) => item.id)
        .filter((id) => /gpt|o\d|text-embedding|omni|tts|whisper/i.test(id))
        .map((id) => ({ id, label: id })),
    );
  }

  if (providerKey === "groq") {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Groq retornou ${response.status}.`);
    }

    const payload = (await response.json()) as { data?: Array<{ id: string }> };
    return sortModels((payload.data || []).map((item) => ({ id: item.id, label: item.id })));
  }

  if (providerKey === "openrouter") {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`OpenRouter retornou ${response.status}.`);
    }

    const payload = (await response.json()) as {
      data?: Array<{ id: string; name?: string; context_length?: number }>;
    };
    return sortModels(
      (payload.data || []).map((item) => ({
        id: item.id,
        label: item.name || item.id,
        contextWindow: item.context_length,
      })),
    );
  }

  if (providerKey === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/models", {
      headers: {
        "x-api-key": token,
        "anthropic-version": "2023-06-01",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Anthropic retornou ${response.status}.`);
    }

    const payload = (await response.json()) as {
      data?: Array<{ id: string; display_name?: string }>;
    };
    return sortModels(
      (payload.data || []).map((item) => ({
        id: item.id,
        label: item.display_name || item.id,
      })),
    );
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(token)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini retornou ${response.status}.`);
  }

  const payload = (await response.json()) as {
    models?: Array<{
      name: string;
      displayName?: string;
      inputTokenLimit?: number;
      supportedGenerationMethods?: string[];
    }>;
  };

  return sortModels(
    (payload.models || [])
      .filter((item) => item.supportedGenerationMethods?.includes("generateContent"))
      .map((item) => ({
        id: item.name.replace("models/", ""),
        label: item.displayName || item.name.replace("models/", ""),
        contextWindow: item.inputTokenLimit,
      })),
  );
};
