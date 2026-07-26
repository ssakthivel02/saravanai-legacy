import { json } from "../shared/http";

export const RELEASE_712_STATUS_ROUTE = "/api/v1/programme/712/source-discovery-and-authority-ranking/status";

export function release712Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 712,
    capability: "Source Discovery and Authority Ranking",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
