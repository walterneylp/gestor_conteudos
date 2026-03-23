"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createJob } from "@/lib/store";
import type { SocialChannel } from "@/lib/types";

const schema = z.object({
  origin: z.enum(["research", "article"]),
  title: z.string().min(3),
  objective: z.string().min(3),
  audience: z.string().min(3),
  language: z.string().min(2),
  tone: z.string().min(3),
  depth: z.string().min(3),
  desiredLength: z.string().min(2),
  sourceSummary: z.string().min(10),
  rawArticle: z.string().optional(),
  sourceUrl: z.string().optional(),
  selectedChannels: z.array(z.enum(["linkedin", "instagram", "x", "facebook"])).min(1),
});

export const createJobAction = async (formData: FormData) => {
  const parsed = schema.parse({
    origin: formData.get("origin"),
    title: formData.get("title"),
    objective: formData.get("objective"),
    audience: formData.get("audience"),
    language: formData.get("language"),
    tone: formData.get("tone"),
    depth: formData.get("depth"),
    desiredLength: formData.get("desiredLength"),
    sourceSummary: formData.get("sourceSummary"),
    rawArticle: formData.get("rawArticle") || undefined,
    sourceUrl: formData.get("sourceUrl") || undefined,
    selectedChannels: formData.getAll("selectedChannels") as SocialChannel[],
  });

  const job = await createJob(parsed);
  redirect(`/jobs/${job.id}`);
};
