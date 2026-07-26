import { json } from "../shared/http";

export const RELEASE_860_STATUS_ROUTE = "/api/v1/programme/860/trust-centre-operations-activation-gate/status";

export function release860Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 860,
    capability: "Trust Centre Operations Activation Gate",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
