import { json } from "../shared/http";

export const RELEASE_678_STATUS_ROUTE = "/api/v1/programme/678/workflow-exception-and-case-management/status";

export function release678Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 678,
    capability: "Workflow Exception and Case Management",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
