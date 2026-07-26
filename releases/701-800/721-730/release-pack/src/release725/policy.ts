import type { FormWorkflowAndDataCaptureBuilder } from "./contracts";

export interface Release725Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateFormWorkflowAndDataCaptureBuilder(value: FormWorkflowAndDataCaptureBuilder): Release725Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_725_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
