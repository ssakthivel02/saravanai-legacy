import { json } from "../shared/http";

export const RELEASE_843_STATUS_ROUTE = "/api/v1/programme/843/project-conversation-and-activity-stream/status";

export function release843Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 843,
    capability: "Project Conversation and Activity Stream",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
