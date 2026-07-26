import { json } from "../shared/http";

export const RELEASE_621_STATUS_ROUTE = "/api/v1/programme/621/enterprise-source-and-collection-registry/status";

export function release621Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 621,
    capability: "Enterprise Source and Collection Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
