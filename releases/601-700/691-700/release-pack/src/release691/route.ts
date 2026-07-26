import { json } from "../shared/http";

export const RELEASE_691_STATUS_ROUTE = "/api/v1/programme/691/enterprise-platform-v6-capability-catalogue/status";

export function release691Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 691,
    capability: "Enterprise Platform v6 Capability Catalogue",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
