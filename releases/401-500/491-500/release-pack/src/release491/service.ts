import type { EnterprisePlatformV4ServiceCatalogue } from "./contracts";
import { validateEnterprisePlatformV4ServiceCatalogue } from "./contracts";
import { evaluateEnterprisePlatformV4ServiceCatalogue } from "./policy";

export function assessRelease491(value: EnterprisePlatformV4ServiceCatalogue) {
  const validationErrors = validateEnterprisePlatformV4ServiceCatalogue(value);
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
    decision: evaluateEnterprisePlatformV4ServiceCatalogue(value)
  };
}
