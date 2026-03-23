"use client";

import { Bot, BrainCircuit, LoaderCircle, RefreshCcw, SearchCode, ShieldCheck } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ApiProvider, LlmProviderKey, ModelOption, SearchProviderKey } from "@/lib/types";

type Props = {
  searchProviders: ApiProvider[];
  llmProviders: ApiProvider[];
  initialPrimary: SearchProviderKey;
  initialFallback: SearchProviderKey;
};

type SearchUiState = {
  providerKey: SearchProviderKey;
  secretConfigured: boolean;
  discoveryKey: string;
};

type LlmUiState = {
  providerKey: LlmProviderKey;
  enabled: boolean;
  priority: number;
  selectedModel: string;
  availableModels: ModelOption[];
  secretConfigured: boolean;
  discoveryKey: string;
  discoveredAt?: string;
};

export const AiRoutingManager = ({
  searchProviders,
  llmProviders,
  initialPrimary,
  initialFallback,
}: Props) => {
  const [primary, setPrimary] = useState<SearchProviderKey>(initialPrimary);
  const [fallback, setFallback] = useState<SearchProviderKey>(initialFallback);
  const [searchMessage, setSearchMessage] = useState<string>();
  const [isSavingSearch, startSavingSearch] = useTransition();
  const [savingSearchProviderKey, setSavingSearchProviderKey] =
    useState<SearchProviderKey | null>(null);
  const [savingProviderKey, setSavingProviderKey] = useState<LlmProviderKey | null>(null);
  const [discoveringProviderKey, setDiscoveringProviderKey] = useState<LlmProviderKey | null>(null);
  const [providerMessage, setProviderMessage] = useState<string>();
  const [searchState, setSearchState] = useState<Record<SearchProviderKey, SearchUiState>>(
    () =>
      Object.fromEntries(
        searchProviders.map((provider) => [
          provider.providerKey as SearchProviderKey,
          {
            providerKey: provider.providerKey as SearchProviderKey,
            secretConfigured: Boolean(provider.secretConfigured),
            discoveryKey: "",
          },
        ]),
      ) as Record<SearchProviderKey, SearchUiState>,
  );
  const [llmState, setLlmState] = useState<Record<LlmProviderKey, LlmUiState>>(
    () =>
      Object.fromEntries(
        llmProviders.map((provider) => [
          provider.providerKey as LlmProviderKey,
          {
            providerKey: provider.providerKey as LlmProviderKey,
            enabled: provider.enabled,
            priority: provider.priority || 5,
            selectedModel: provider.selectedModel || "",
            availableModels: provider.availableModels || [],
            secretConfigured: Boolean(provider.secretConfigured),
            discoveryKey: "",
            discoveredAt: provider.discoveredAt,
          },
        ]),
      ) as Record<LlmProviderKey, LlmUiState>,
  );

  const sortedProviders = useMemo(
    () =>
      [...llmProviders].sort(
        (left, right) =>
          (llmState[left.providerKey as LlmProviderKey]?.priority || 99) -
          (llmState[right.providerKey as LlmProviderKey]?.priority || 99),
      ),
    [llmProviders, llmState],
  );

  const saveSearchRouting = () => {
    setSearchMessage(undefined);

    startSavingSearch(async () => {
      const response = await fetch("/api/settings/search-routing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ primary, fallback }),
      });

      const payload = (await response.json()) as { error?: string };
      setSearchMessage(payload.error || "Roteamento de busca salvo.");
    });
  };

  const saveSearchProvider = async (providerKey: SearchProviderKey) => {
    const state = searchState[providerKey];

    if (!state.discoveryKey.trim()) {
      setSearchMessage(`Informe a API key temporaria para ${providerKey}.`);
      return;
    }

    setSavingSearchProviderKey(providerKey);
    setSearchMessage(undefined);

    try {
      const response = await fetch("/api/settings/search-providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerKey,
          secretConfigured: true,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Falha ao salvar provider de busca.");
      }

      setSearchState((current) => ({
        ...current,
        [providerKey]: {
          ...current[providerKey],
          secretConfigured: true,
        },
      }));
      setSearchMessage(`API key de ${providerKey} recebida para configuracao.`);
    } catch (error) {
      setSearchMessage(error instanceof Error ? error.message : "Falha ao salvar provider.");
    } finally {
      setSavingSearchProviderKey(null);
    }
  };

  const discoverModels = async (providerKey: LlmProviderKey) => {
    const state = llmState[providerKey];

    if (!state.discoveryKey.trim()) {
      setProviderMessage(`Informe uma API key para ${providerKey}.`);
      return;
    }

    setProviderMessage(undefined);
    setDiscoveringProviderKey(providerKey);

    try {
      const response = await fetch("/api/providers/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerKey,
          apiKey: state.discoveryKey,
        }),
      });

      const payload = (await response.json()) as {
        models?: ModelOption[];
        error?: string;
      };

      if (!response.ok || !payload.models) {
        throw new Error(payload.error || "Nao foi possivel descobrir os modelos.");
      }

      const models = payload.models;

      setLlmState((current) => ({
        ...current,
        [providerKey]: {
          ...current[providerKey],
          availableModels: models,
          selectedModel: current[providerKey].selectedModel || models[0]?.id || "",
          secretConfigured: true,
          discoveredAt: new Date().toISOString(),
        },
      }));

      setProviderMessage(`Modelos de ${providerKey} carregados.`);
    } catch (error) {
      setProviderMessage(error instanceof Error ? error.message : "Falha ao descobrir modelos.");
    } finally {
      setDiscoveringProviderKey(null);
    }
  };

  const saveLlmProvider = async (providerKey: LlmProviderKey) => {
    setProviderMessage(undefined);
    setSavingProviderKey(providerKey);

    try {
      const state = llmState[providerKey];
      const response = await fetch("/api/settings/llm-providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerKey,
          enabled: state.enabled,
          priority: state.priority,
          selectedModel: state.selectedModel || undefined,
          availableModels: state.availableModels,
          secretConfigured: state.secretConfigured,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Falha ao salvar provedor.");
      }

      setProviderMessage(`Configuracao de ${providerKey} salva.`);
    } catch (error) {
      setProviderMessage(error instanceof Error ? error.message : "Falha ao salvar provedor.");
    } finally {
      setSavingProviderKey(null);
    }
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
      <Card className="space-y-4 rounded-[30px]">
        <div>
          <p className="eyebrow text-[var(--ink-soft)]">Busca</p>
          <h2 className="mt-2 text-xl font-semibold">Primária e fallback</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
            Você pode alternar entre Brave e Serper como fonte primária ou fallback de pesquisa.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
            <label className="text-sm font-semibold">Primária</label>
            <Select
              className="mt-3"
              value={primary}
              onChange={(event) => setPrimary(event.target.value as SearchProviderKey)}
            >
              <option value="brave">Brave Search</option>
              <option value="serper">Serper</option>
            </Select>
          </div>

          <div className="rounded-[24px] bg-[var(--surface-contrast)] p-4">
            <label className="text-sm font-semibold">Fallback</label>
            <Select
              className="mt-3"
              value={fallback}
              onChange={(event) => setFallback(event.target.value as SearchProviderKey)}
            >
              <option value="brave">Brave Search</option>
              <option value="serper">Serper</option>
            </Select>
          </div>
        </div>

        <div className="grid gap-3">
          {searchProviders.map((provider) => {
            const providerKey = provider.providerKey as SearchProviderKey;
            const state = searchState[providerKey];

            return (
            <div key={provider.id} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                    <SearchCode className="h-4 w-4 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-semibold">{provider.name}</p>
                    <p className="text-sm text-[var(--ink-soft)]">{provider.endpoint}</p>
                  </div>
                </div>
                <Badge color={provider.providerKey === primary ? "accent" : "neutral"}>
                  {provider.providerKey === primary ? "primária" : "fallback"}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_auto]">
                <Input
                  type="password"
                  placeholder={`API key temporaria para ${provider.name}`}
                  value={state.discoveryKey}
                  onChange={(event) =>
                    setSearchState((current) => ({
                      ...current,
                      [providerKey]: {
                        ...current[providerKey],
                        discoveryKey: event.target.value,
                      },
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => saveSearchProvider(providerKey)}
                  disabled={savingSearchProviderKey === providerKey}
                >
                  {savingSearchProviderKey === providerKey ? "Salvando..." : "Salvar key"}
                </Button>
              </div>
              <div className="mt-3">
                <Badge color={state.secretConfigured ? "success" : "warning"}>
                  {state.secretConfigured ? "key recebida" : "key pendente"}
                </Badge>
              </div>
            </div>
          )})}
        </div>

        <Button
          type="button"
          onClick={saveSearchRouting}
          disabled={primary === fallback || isSavingSearch}
        >
          {isSavingSearch ? "Salvando..." : "Salvar roteamento de busca"}
        </Button>

        {searchMessage ? (
          <p className="text-sm text-[var(--ink-soft)]">{searchMessage}</p>
        ) : null}
      </Card>

      <Card className="space-y-5 rounded-[30px]">
        <div>
          <p className="eyebrow text-[var(--ink-soft)]">LLMs</p>
          <h2 className="mt-2 text-xl font-semibold">Até 5 provedores com seleção de modelo</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
            Configure OpenAI, Groq, OpenRouter, Claude e Gemini. Ao informar a chave da API, o app consulta os modelos disponíveis e permite escolher o melhor para cada provedor.
          </p>
        </div>

        <div className="grid gap-4">
          {sortedProviders.map((provider) => {
            const providerKey = provider.providerKey as LlmProviderKey;
            const state = llmState[providerKey];

            return (
              <div
                key={provider.id}
                className="rounded-[26px] border border-[var(--line)] bg-[var(--surface-contrast)] p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                        <Bot className="h-4 w-4 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="font-semibold">{provider.name}</p>
                        <p className="text-sm text-[var(--ink-soft)]">{provider.notes}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge color={state.secretConfigured ? "success" : "warning"}>
                        {state.secretConfigured ? "configurado" : "sem chave salva"}
                      </Badge>
                      {state.selectedModel ? <Badge color="accent">{state.selectedModel}</Badge> : null}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3 xl:min-w-[420px]">
                    <label className="rounded-[20px] bg-[var(--surface-strong)] p-3 text-sm">
                      <span className="font-semibold">Ativo</span>
                      <input
                        className="mt-3 h-4 w-4 accent-[var(--accent)]"
                        type="checkbox"
                        checked={state.enabled}
                        onChange={(event) =>
                          setLlmState((current) => ({
                            ...current,
                            [providerKey]: {
                              ...current[providerKey],
                              enabled: event.target.checked,
                            },
                          }))
                        }
                      />
                    </label>

                    <label className="rounded-[20px] bg-[var(--surface-strong)] p-3 text-sm">
                      <span className="font-semibold">Prioridade</span>
                      <Input
                        className="mt-3"
                        type="number"
                        min={1}
                        max={5}
                        value={state.priority}
                        onChange={(event) =>
                          setLlmState((current) => ({
                            ...current,
                            [providerKey]: {
                              ...current[providerKey],
                              priority: Number(event.target.value || 5),
                            },
                          }))
                        }
                      />
                    </label>

                    <label className="rounded-[20px] bg-[var(--surface-strong)] p-3 text-sm">
                      <span className="font-semibold">Modelo</span>
                      <Select
                        className="mt-3"
                        value={state.selectedModel}
                        onChange={(event) =>
                          setLlmState((current) => ({
                            ...current,
                            [providerKey]: {
                              ...current[providerKey],
                              selectedModel: event.target.value,
                            },
                          }))
                        }
                      >
                        <option value="">Selecione um modelo</option>
                        {state.availableModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.label}
                          </option>
                        ))}
                      </Select>
                    </label>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_auto_auto]">
                  <Input
                    type="password"
                    placeholder={`API key temporaria para ${provider.name}`}
                    value={state.discoveryKey}
                    onChange={(event) =>
                      setLlmState((current) => ({
                        ...current,
                        [providerKey]: {
                          ...current[providerKey],
                          discoveryKey: event.target.value,
                        },
                      }))
                    }
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => discoverModels(providerKey)}
                    disabled={discoveringProviderKey === providerKey}
                  >
                    {discoveringProviderKey === providerKey ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Consultando
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Descobrir modelos
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => saveLlmProvider(providerKey)}
                    disabled={savingProviderKey === providerKey}
                  >
                    {savingProviderKey === providerKey ? "Salvando..." : "Salvar provedor"}
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--ink-soft)]">
                  <span className="inline-flex items-center gap-2">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    endpoint: {provider.endpoint}
                  </span>
                  {state.discoveredAt ? (
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      catálogo atualizado localmente
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {providerMessage ? <p className="text-sm text-[var(--ink-soft)]">{providerMessage}</p> : null}
      </Card>
    </section>
  );
};
