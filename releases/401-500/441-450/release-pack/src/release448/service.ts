import type { MasterDataAndReferenceSynchronisationV2 } from "./contracts";
import { validateMasterDataAndReferenceSynchronisationV2 } from "./contracts";
import { evaluateMasterDataAndReferenceSynchronisationV2 } from "./policy";

export function assessRelease448(value: MasterDataAndReferenceSynchronisationV2) {
  const validationErrors = validateMasterDataAndReferenceSynchronisationV2(value);
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
    decision: evaluateMasterDataAndReferenceSynchronisationV2(value)
  };
}
