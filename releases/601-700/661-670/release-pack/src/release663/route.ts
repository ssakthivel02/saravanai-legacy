import { json } from "../shared/http";

export const RELEASE_663_STATUS_ROUTE = "/api/v1/programme/663/slo-error-budget-and-reliability-policy/status";

export function release663Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 663,
    capability: "SLO Error Budget and Reliability Policy",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
