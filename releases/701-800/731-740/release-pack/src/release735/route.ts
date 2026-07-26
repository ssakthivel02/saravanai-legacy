import { json } from "../shared/http";

export const RELEASE_735_STATUS_ROUTE = "/api/v1/programme/735/customer-request-and-case-intake/status";

export function release735Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 735,
    capability: "Customer Request and Case Intake",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
