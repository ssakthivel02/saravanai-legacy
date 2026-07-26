export interface AccessibilityEvidence {
  automatedChecks: string[];
  manualChecks: string[];
  assistiveTechnologies: string[];
  unresolvedFindings: string[];
}

export function accessibilityReady(value: AccessibilityEvidence): boolean {
  return value.manualChecks.length > 0 && value.unresolvedFindings.length === 0;
}
