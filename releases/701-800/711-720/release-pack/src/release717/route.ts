import { json } from "../shared/http";

export const RELEASE_717_STATUS_ROUTE = "/api/v1/programme/717/research-quality-and-bias-review/status";

export function release717Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 717,
    capability: "Research Quality and Bias Review",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
