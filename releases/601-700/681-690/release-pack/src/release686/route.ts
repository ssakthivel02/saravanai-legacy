import { json } from "../shared/http";

export const RELEASE_686_STATUS_ROUTE = "/api/v1/programme/686/policy-exception-and-risk-acceptance-v2/status";

export function release686Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 686,
    capability: "Policy Exception and Risk Acceptance v2",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
