export interface AutomationGate {
  gateId: string;
  releaseRange: '261-270';
  processEvidence: string[];
  safetyEvidence: string[];
  valueEvidence: string[];
  recoveryEvidence: string[];
  decision: 'pending' | 'go' | 'conditional_go' | 'no_go';
}

export const RELEASE_270_CONTROLS = ["process_evidence_required", "safety_evidence_required", "value_evidence_required", "recovery_evidence_required"] as const;

export function validateAutomationGate(value: AutomationGate): string[] {
  const errors: string[] = [];
  if (!value.gateId.trim()) errors.push("gateId_required");
  if (!value.processEvidence.length) errors.push("processEvidence_required");
  if (!value.safetyEvidence.length) errors.push("safetyEvidence_required");
  if (!value.valueEvidence.length) errors.push("valueEvidence_required");
  if (!value.recoveryEvidence.length) errors.push("recoveryEvidence_required");
  return [...new Set(errors)];
}
