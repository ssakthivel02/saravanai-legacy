import { json } from "../shared/http";

export const RELEASE_631_STATUS_ROUTE = "/api/v1/programme/631/data-residency-and-sovereignty-registry/status";

export function release631Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 631,
    capability: "Data Residency and Sovereignty Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
