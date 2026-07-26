import { json } from "../shared/http";

export const RELEASE_778_STATUS_ROUTE = "/api/v1/programme/778/data-product-marketplace-and-discovery/status";

export function release778Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 778,
    capability: "Data Product Marketplace and Discovery",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
