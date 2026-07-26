import type { ScenarioDefinition } from "./model";

export const RELEASE_068_CONTROL_RULES = ["assumptions_required", "probability_range", "production_side_effects_must_be_false", "approval_required_for_external_distribution"] as const;

export function validateScenarioDefinition(input: ScenarioDefinition): string[] {
  const errors: string[] = [];
  if (!String(input.scenarioId ?? "").trim()) errors.push("scenarioId_required");
  if (!input.assumptions.length) errors.push("assumptions_required");
  if (input.probability < 0 || input.probability > 1) errors.push("probability_out_of_range");
  if (input.productionSideEffects !== false) errors.push("productionSideEffects_must_be_false");
  return [...new Set(errors)];
}

export function release068Ready(input: ScenarioDefinition): boolean {
  return validateScenarioDefinition(input).length === 0;
}
