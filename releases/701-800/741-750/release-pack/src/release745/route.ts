import { json } from "../shared/http";

export const RELEASE_745_STATUS_ROUTE = "/api/v1/programme/745/learning-progress-and-mastery-evidence/status";

export function release745Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 745,
    capability: "Learning Progress and Mastery Evidence",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
