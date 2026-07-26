import { json } from "../shared/http";

export const RELEASE_709_STATUS_ROUTE = "/api/v1/programme/709/evaluation-evidence-and-decision-dashboard/status";

export function release709Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 709,
    capability: "Evaluation Evidence and Decision Dashboard",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
