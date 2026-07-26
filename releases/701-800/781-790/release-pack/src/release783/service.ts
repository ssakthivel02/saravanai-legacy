import type { ProgrammeMilestoneAndDependencyControl } from "./contracts";
import { validateProgrammeMilestoneAndDependencyControl } from "./contracts";
import { evaluateProgrammeMilestoneAndDependencyControl } from "./policy";

export function assessRelease783(value: ProgrammeMilestoneAndDependencyControl) {
  const validationErrors = validateProgrammeMilestoneAndDependencyControl(value);
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
    decision: evaluateProgrammeMilestoneAndDependencyControl(value)
  };
}
