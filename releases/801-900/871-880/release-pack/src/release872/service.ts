import type { SimulationScenarioAndAssumptionContract } from "./contracts";
import { validateSimulationScenarioAndAssumptionContract } from "./contracts";
import { evaluateSimulationScenarioAndAssumptionContract } from "./policy";

export function assessRelease872(value: SimulationScenarioAndAssumptionContract) {
  const validationErrors = validateSimulationScenarioAndAssumptionContract(value);
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
    decision: evaluateSimulationScenarioAndAssumptionContract(value)
  };
}
