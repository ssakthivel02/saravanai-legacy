import { json } from "../shared/http";

export const RELEASE_669_STATUS_ROUTE = "/api/v1/programme/669/post-incident-learning-and-action-tracking/status";

export function release669Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 669,
    capability: "Post-Incident Learning and Action Tracking",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
