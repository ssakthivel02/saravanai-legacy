import { json } from "../shared/http";

export const RELEASE_601_STATUS_ROUTE = "/api/v1/programme/601/ai-runtime-service-registry/status";

export function release601Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 601,
    capability: "AI Runtime Service Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
