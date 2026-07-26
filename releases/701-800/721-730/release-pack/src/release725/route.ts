import { json } from "../shared/http";

export const RELEASE_725_STATUS_ROUTE = "/api/v1/programme/725/form-workflow-and-data-capture-builder/status";

export function release725Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 725,
    capability: "Form Workflow and Data Capture Builder",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
