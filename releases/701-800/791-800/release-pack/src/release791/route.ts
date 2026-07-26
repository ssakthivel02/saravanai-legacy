import { json } from "../shared/http";

export const RELEASE_791_STATUS_ROUTE = "/api/v1/programme/791/enterprise-platform-v7-capability-catalogue/status";

export function release791Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 791,
    capability: "Enterprise Platform v7 Capability Catalogue",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
