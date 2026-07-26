import { json } from "../shared/http";

export const RELEASE_630_STATUS_ROUTE = "/api/v1/programme/630/enterprise-retrieval-assurance-gate/status";

export function release630Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 630,
    capability: "Enterprise Retrieval Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
