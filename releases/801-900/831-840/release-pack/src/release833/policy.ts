import type { TenantScopedIndexAndRetrievalRuntime } from "./contracts";

export interface Release833Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateTenantScopedIndexAndRetrievalRuntime(value: TenantScopedIndexAndRetrievalRuntime): Release833Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_833_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
