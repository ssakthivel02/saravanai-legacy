import type { DependencyAndPackageAdmission } from "./contracts";
import { validateDependencyAndPackageAdmission } from "./contracts";
import { evaluateDependencyAndPackageAdmission } from "./policy";

export function assessRelease654(value: DependencyAndPackageAdmission) {
  const validationErrors = validateDependencyAndPackageAdmission(value);
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
    decision: evaluateDependencyAndPackageAdmission(value)
  };
}
