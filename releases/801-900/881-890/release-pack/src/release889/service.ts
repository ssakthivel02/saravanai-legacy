import type { EconomicStressTestAndHardStopExercise } from "./contracts";
import { validateEconomicStressTestAndHardStopExercise } from "./contracts";
import { evaluateEconomicStressTestAndHardStopExercise } from "./policy";

export function assessRelease889(value: EconomicStressTestAndHardStopExercise) {
  const validationErrors = validateEconomicStressTestAndHardStopExercise(value);
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
    decision: evaluateEconomicStressTestAndHardStopExercise(value)
  };
}
