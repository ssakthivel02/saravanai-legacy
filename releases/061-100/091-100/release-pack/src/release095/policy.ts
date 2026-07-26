import type { DigitalTwin } from "./model";

export const RELEASE_095_CONTROL_RULES = ["service_model_required", "dependency_model_required", "synthetic_or_sanitised_data_only", "production_credentials_must_be_false", "validation_required_before_active"] as const;

export function validateDigitalTwin(input: DigitalTwin): string[] {
  const errors: string[] = [];
  if (!String(input.twinId ?? "").trim()) errors.push("twinId_required");
  if (!input.serviceModels.length) errors.push("serviceModels_required");
  if (!input.dependencyModels.length) errors.push("dependencyModels_required");
  if (input.productionCredentialsAvailable !== false) errors.push("productionCredentialsAvailable_must_be_false");
  return [...new Set(errors)];
}

export function release095Ready(input: DigitalTwin): boolean {
  return validateDigitalTwin(input).length === 0;
}
