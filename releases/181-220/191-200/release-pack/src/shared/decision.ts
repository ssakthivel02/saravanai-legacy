export interface PolicyDecision {
  allowed: boolean;
  reason: string;
  obligations: string[];
  evidenceRefs?: string[];
}

export function deny(reason: string, obligations: string[] = []): PolicyDecision {
  return { allowed: false, reason, obligations: ["audit_decision", ...obligations] };
}
