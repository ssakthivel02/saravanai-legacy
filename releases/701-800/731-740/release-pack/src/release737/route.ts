import { json } from "../shared/http";

export const RELEASE_737_STATUS_ROUTE = "/api/v1/programme/737/complaint-appeal-and-redress-operations/status";

export function release737Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 737,
    capability: "Complaint Appeal and Redress Operations",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
