import { json } from "../shared/http";

export const RELEASE_744_STATUS_ROUTE = "/api/v1/programme/744/assessment-question-bank-and-integrity/status";

export function release744Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 744,
    capability: "Assessment Question Bank and Integrity",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
