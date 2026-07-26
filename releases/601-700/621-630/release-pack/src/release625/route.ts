import { json } from "../shared/http";

export const RELEASE_625_STATUS_ROUTE = "/api/v1/programme/625/hybrid-search-and-ranking-evaluation/status";

export function release625Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 625,
    capability: "Hybrid Search and Ranking Evaluation",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
