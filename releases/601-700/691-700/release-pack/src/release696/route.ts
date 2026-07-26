import { json } from "../shared/http";

export const RELEASE_696_STATUS_ROUTE = "/api/v1/programme/696/service-continuity-and-provider-exit-v4/status";

export function release696Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 696,
    capability: "Service Continuity and Provider Exit v4",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
