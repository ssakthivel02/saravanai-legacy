import type { ContinuityExitPlan } from "./model";

export const RELEASE_098_CONTROL_RULES = ["export_format_required", "provider_exit_steps_required", "credential_revocation_required", "archive_policy_required", "rehearsal_required"] as const;

export function validateContinuityExitPlan(input: ContinuityExitPlan): string[] {
  const errors: string[] = [];
  if (!String(input.planId ?? "").trim()) errors.push("planId_required");
  if (!input.providerExitSteps.length) errors.push("providerExitSteps_required");
  if (!input.credentialRevocationSteps.length) errors.push("credentialRevocationSteps_required");
  return [...new Set(errors)];
}

export function release098Ready(input: ContinuityExitPlan): boolean {
  return validateContinuityExitPlan(input).length === 0;
}
