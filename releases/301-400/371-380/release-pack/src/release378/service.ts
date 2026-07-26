import type { ClimateAndExtremeWeatherResilience } from "./contracts";
import { validateClimateAndExtremeWeatherResilience } from "./contracts";
import { evaluateClimateAndExtremeWeatherResilience } from "./policy";

export function assessRelease378(value: ClimateAndExtremeWeatherResilience) {
  const validationErrors = validateClimateAndExtremeWeatherResilience(value);
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
    decision: evaluateClimateAndExtremeWeatherResilience(value)
  };
}
