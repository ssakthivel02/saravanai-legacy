import { json } from "../shared/http";

export const RELEASE_761_STATUS_ROUTE = "/api/v1/programme/761/hybrid-infrastructure-service-catalogue/status";

export function release761Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 761,
    capability: "Hybrid Infrastructure Service Catalogue",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
