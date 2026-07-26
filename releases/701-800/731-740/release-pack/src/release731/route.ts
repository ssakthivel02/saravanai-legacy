import { json } from "../shared/http";

export const RELEASE_731_STATUS_ROUTE = "/api/v1/programme/731/enterprise-communication-campaign-registry/status";

export function release731Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 731,
    capability: "Enterprise Communication Campaign Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
