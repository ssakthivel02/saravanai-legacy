import { json } from "../shared/http";

export const RELEASE_751_STATUS_ROUTE = "/api/v1/programme/751/industrial-asset-and-site-registry/status";

export function release751Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 751,
    capability: "Industrial Asset and Site Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
