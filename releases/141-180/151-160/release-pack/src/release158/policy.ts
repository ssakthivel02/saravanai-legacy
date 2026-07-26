import type { SupplierRecord } from "./contracts";

export interface Release158Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateSupplierRecord(value: SupplierRecord): Release158Decision {
  if (value.riskRating >= 70) return { allowed: false, reason: "supplier_risk_threshold", obligations: ["risk_review"] };
  return { allowed: true, reason: "release_158_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
