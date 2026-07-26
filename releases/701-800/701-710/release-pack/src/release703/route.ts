import { json } from "../shared/http";

export const RELEASE_703_STATUS_ROUTE = "/api/v1/programme/703/safety-evaluation-and-harm-taxonomy/status";

export function release703Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 703,
    capability: "Safety Evaluation and Harm Taxonomy",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
