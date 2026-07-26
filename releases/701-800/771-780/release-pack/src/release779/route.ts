import { json } from "../shared/http";

export const RELEASE_779_STATUS_ROUTE = "/api/v1/programme/779/data-product-deprecation-and-portability/status";

export function release779Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 779,
    capability: "Data Product Deprecation and Portability",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
