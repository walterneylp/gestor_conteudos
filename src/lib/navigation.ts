import { BarChart3, CheckCheck, FileStack, Network, Sparkles } from "lucide-react";
import type { SocialChannel } from "@/lib/types";

export const primaryNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/jobs", label: "Jobs", icon: FileStack },
  { href: "/approvals", label: "Aprovacoes", icon: CheckCheck },
  { href: "/audit", label: "Auditoria", icon: Sparkles },
  { href: "/settings", label: "Integracoes", icon: Network },
];

export const socialLabels: Record<SocialChannel, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  facebook: "Facebook",
};
