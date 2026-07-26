import { json } from "../shared/http";

export const RELEASE_629_STATUS_ROUTE = "/api/v1/programme/629/knowledge-feedback-and-correction-workflow/status";

export function release629Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 629,
    capability: "Knowledge Feedback and Correction Workflow",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
