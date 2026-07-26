import { json } from "../shared/http";

export const RELEASE_824_STATUS_ROUTE = "/api/v1/programme/824/human-approval-inbox-and-decision-runtime/status";

export function release824Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 824,
    capability: "Human Approval Inbox and Decision Runtime",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
