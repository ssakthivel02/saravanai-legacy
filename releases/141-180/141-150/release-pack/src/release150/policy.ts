import type { ExperienceGate } from "./contracts";

export interface Release150Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateExperienceGate(value: ExperienceGate): Release150Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if (!value.accessibilityEvidence.length) return { allowed: false, reason: "accessibility_evidence_required", obligations: ["accessibility_review"] };
  return { allowed: true, reason: "release_150_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
