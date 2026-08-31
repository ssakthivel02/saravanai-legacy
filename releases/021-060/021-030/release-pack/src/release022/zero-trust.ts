import type { Decision, RequestContext } from "../shared/types";
import { secureId } from "../shared/ids";

export interface AccessSignal {
  country?: string;
  deviceTrusted: boolean;
  accessAuthenticated: boolean;
  ipReputation: "good" | "unknown" | "bad";
  requestedSensitivity: "public" | "internal" | "confidential" | "restricted";
}

export function evaluateZeroTrust(ctx: RequestContext, signal: AccessSignal): Decision {
  const obligations: string[] = ["audit_decision"];
  if (!signal.accessAuthenticated) {
    return { allowed: false, reason: "cloudflare_access_required", obligations, decisionId: secureId("zt") };
  }
  if (signal.ipReputation === "bad") {
    return { allowed: false, reason: "ip_reputation_denied", obligations, decisionId: secureId("zt") };
  }
  if (signal.requestedSensitivity === "restricted" && !signal.deviceTrusted) {
    return { allowed: false, reason: "trusted_device_required", obligations, decisionId: secureId("zt") };
  }
  if (ctx.riskScore >= 70) {
    obligations.push("step_up_authentication");
    return { allowed: false, reason: "risk_threshold_exceeded", obligations, decisionId: secureId("zt") };
  }
  if (ctx.riskScore >= 40) obligations.push("enhanced_monitoring");
  return { allowed: true, reason: "zero_trust_policy_satisfied", obligations, decisionId: secureId("zt") };
}
