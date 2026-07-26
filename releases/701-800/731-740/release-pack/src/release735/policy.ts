import type { CustomerRequestAndCaseIntake } from "./contracts";

export interface Release735Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateCustomerRequestAndCaseIntake(value: CustomerRequestAndCaseIntake): Release735Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_735_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
