import { json } from "../shared/http";

export const RELEASE_736_STATUS_ROUTE = "/api/v1/programme/736/case-resolution-and-knowledge-guidance/status";

export function release736Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 736,
    capability: "Case Resolution and Knowledge Guidance",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
