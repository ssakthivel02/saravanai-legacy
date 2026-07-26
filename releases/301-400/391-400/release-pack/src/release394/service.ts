import type { DataAndPlatformExitProgramme } from "./contracts";
import { validateDataAndPlatformExitProgramme } from "./contracts";
import { evaluateDataAndPlatformExitProgramme } from "./policy";

export function assessRelease394(value: DataAndPlatformExitProgramme) {
  const validationErrors = validateDataAndPlatformExitProgramme(value);
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
    decision: evaluateDataAndPlatformExitProgramme(value)
  };
}
