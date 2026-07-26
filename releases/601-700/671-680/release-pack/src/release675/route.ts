import { json } from "../shared/http";

export const RELEASE_675_STATUS_ROUTE = "/api/v1/programme/675/document-and-form-automation/status";

export function release675Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 675,
    capability: "Document and Form Automation",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
