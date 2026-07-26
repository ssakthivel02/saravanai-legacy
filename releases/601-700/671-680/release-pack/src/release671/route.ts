import { json } from "../shared/http";

export const RELEASE_671_STATUS_ROUTE = "/api/v1/programme/671/business-process-and-workflow-registry/status";

export function release671Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 671,
    capability: "Business Process and Workflow Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
