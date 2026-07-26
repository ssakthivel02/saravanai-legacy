import type { InteractiveLessonAndPracticeGenerator } from "./contracts";

export interface Release743Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateInteractiveLessonAndPracticeGenerator(value: InteractiveLessonAndPracticeGenerator): Release743Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_743_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
