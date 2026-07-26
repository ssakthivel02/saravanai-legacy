import type { WebsiteAndWebApplicationScaffold } from "./contracts";

export interface Release723Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateWebsiteAndWebApplicationScaffold(value: WebsiteAndWebApplicationScaffold): Release723Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_723_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
