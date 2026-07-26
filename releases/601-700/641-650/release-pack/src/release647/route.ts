import { json } from "../shared/http";

export const RELEASE_647_STATUS_ROUTE = "/api/v1/programme/647/content-moderation-and-sensitive-context-review/status";

export function release647Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 647,
    capability: "Content Moderation and Sensitive Context Review",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
