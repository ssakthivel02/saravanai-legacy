import { json } from "../shared/http";

export const RELEASE_839_STATUS_ROUTE = "/api/v1/programme/839/knowledge-correction-reindex-and-notification/status";

export function release839Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 839,
    capability: "Knowledge Correction Reindex and Notification",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
