import { json } from "../shared/http";

export const RELEASE_780_STATUS_ROUTE = "/api/v1/programme/780/data-products-and-semantic-layer-assurance-gate/status";

export function release780Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 780,
    capability: "Data Products and Semantic Layer Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
