import type { KnowledgeAndResearchRuntimeActivationGate } from "./contracts";

export interface Release840Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateKnowledgeAndResearchRuntimeActivationGate(value: KnowledgeAndResearchRuntimeActivationGate): Release840Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).approvedBy.length < 2) return { allowed: false, reason: "multi_party_approval_required", obligations: ["independent_approval"] };
  return { allowed: true, reason: "release_840_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
