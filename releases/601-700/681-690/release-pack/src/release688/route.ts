import { json } from "../shared/http";

export const RELEASE_688_STATUS_ROUTE = "/api/v1/programme/688/management-assertion-and-disclosure-control/status";

export function release688Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 688,
    capability: "Management Assertion and Disclosure Control",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
