import { json } from "../shared/http";

export const RELEASE_699_STATUS_ROUTE = "/api/v1/programme/699/enterprise-platform-v6-general-availability-board/status";

export function release699Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 699,
    capability: "Enterprise Platform v6 General Availability Board",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
