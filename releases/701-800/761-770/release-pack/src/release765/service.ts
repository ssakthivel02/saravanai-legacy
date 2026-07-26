import type { HybridConnectivityAndNetworkAutomation } from "./contracts";
import { validateHybridConnectivityAndNetworkAutomation } from "./contracts";
import { evaluateHybridConnectivityAndNetworkAutomation } from "./policy";

export function assessRelease765(value: HybridConnectivityAndNetworkAutomation) {
  const validationErrors = validateHybridConnectivityAndNetworkAutomation(value);
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
    decision: evaluateHybridConnectivityAndNetworkAutomation(value)
  };
}
