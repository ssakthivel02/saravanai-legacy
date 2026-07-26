import { json } from "../shared/http";

export const RELEASE_747_STATUS_ROUTE = "/api/v1/programme/747/interview-simulation-and-feedback/status";

export function release747Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 747,
    capability: "Interview Simulation and Feedback",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
