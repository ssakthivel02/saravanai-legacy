import type { DataContractAndSchemaEvolution } from "./contracts";
import { validateDataContractAndSchemaEvolution } from "./contracts";
import { evaluateDataContractAndSchemaEvolution } from "./policy";

export function assessRelease772(value: DataContractAndSchemaEvolution) {
  const validationErrors = validateDataContractAndSchemaEvolution(value);
  if (validationErrors.length) {
    return {
      valid: false,
      validationErrors,
      decision: { allowed: false, reason: "validation_failed", obligations: ["correct_input"] }
    };
  }
  return {
    valid: true,
    validationErrors: [],
    decision: evaluateDataContractAndSchemaEvolution(value)
  };
}
