import { json } from "../shared/http";

export const RELEASE_788_STATUS_ROUTE = "/api/v1/programme/788/benefits-outcomes-and-value-realisation/status";

export function release788Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 788,
    capability: "Benefits Outcomes and Value Realisation",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
