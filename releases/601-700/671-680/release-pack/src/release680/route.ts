import { json } from "../shared/http";

export const RELEASE_680_STATUS_ROUTE = "/api/v1/programme/680/business-automation-assurance-gate/status";

export function release680Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 680,
    capability: "Business Automation Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
