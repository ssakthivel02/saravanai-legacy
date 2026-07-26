export interface AiProductionGate {
  gateId: string;
  releaseRange: '181-190';
  evaluationEvidence: string[];
  safetyEvidence: string[];
  operationsEvidence: string[];
  recoveryEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_190_CONTROLS = ["evaluation_evidence_required", "safety_evidence_required", "operations_evidence_required", "recovery_evidence_required"] as const;

export function validateAiProductionGate(value: AiProductionGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.evaluationEvidence.length) errors.push("evaluationEvidence_required");
  if (!value.safetyEvidence.length) errors.push("safetyEvidence_required");
  if (!value.operationsEvidence.length) errors.push("operationsEvidence_required");
  if (!value.recoveryEvidence.length) errors.push("recoveryEvidence_required");
  return [...new Set(errors)];
}
