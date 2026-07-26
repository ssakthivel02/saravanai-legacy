import { json } from "../shared/http";

export const RELEASE_798_STATUS_ROUTE = "/api/v1/programme/798/commercial-service-definition-without-billing-v3/status";

export function release798Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 798,
    capability: "Commercial Service Definition without Billing v3",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
