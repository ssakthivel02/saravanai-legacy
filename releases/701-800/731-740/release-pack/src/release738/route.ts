import { json } from "../shared/http";

export const RELEASE_738_STATUS_ROUTE = "/api/v1/programme/738/service-quality-and-conversation-review/status";

export function release738Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 738,
    capability: "Service Quality and Conversation Review",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
