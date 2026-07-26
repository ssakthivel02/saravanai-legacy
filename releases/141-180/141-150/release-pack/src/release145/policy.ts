import type { LocaleRelease } from "./contracts";

export interface Release145Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateLocaleRelease(value: LocaleRelease): Release145Decision {
  if (value.missingKeys.length) return { allowed: false, reason: "locale_incomplete", obligations: ["translation_review"] };
  return { allowed: true, reason: "release_145_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
