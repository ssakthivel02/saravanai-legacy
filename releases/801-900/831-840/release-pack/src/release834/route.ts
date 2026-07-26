import { json } from "../shared/http";

export const RELEASE_834_STATUS_ROUTE = "/api/v1/programme/834/hybrid-retrieval-ranking-and-freshness-policy/status";

export function release834Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 834,
    capability: "Hybrid Retrieval Ranking and Freshness Policy",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
