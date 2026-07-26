import { json } from "../shared/http";

export const RELEASE_787_STATUS_ROUTE = "/api/v1/programme/787/crisis-command-and-stakeholder-coordination/status";

export function release787Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 787,
    capability: "Crisis Command and Stakeholder Coordination",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
