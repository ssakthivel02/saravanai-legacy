import { json } from "../shared/http";

export const RELEASE_673_STATUS_ROUTE = "/api/v1/programme/673/human-task-inbox-and-delegation/status";

export function release673Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 673,
    capability: "Human Task Inbox and Delegation",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
