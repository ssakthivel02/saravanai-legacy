import { json } from "../shared/http";

export const RELEASE_719_STATUS_ROUTE = "/api/v1/programme/719/research-correction-and-retraction-workflow/status";

export function release719Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 719,
    capability: "Research Correction and Retraction Workflow",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
