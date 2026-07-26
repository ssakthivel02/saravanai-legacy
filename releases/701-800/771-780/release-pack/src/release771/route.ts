import { json } from "../shared/http";

export const RELEASE_771_STATUS_ROUTE = "/api/v1/programme/771/enterprise-data-product-registry/status";

export function release771Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 771,
    capability: "Enterprise Data Product Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
