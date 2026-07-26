import { json } from "../shared/http";

export const RELEASE_706_STATUS_ROUTE = "/api/v1/programme/706/fairness-and-accessibility-evaluation/status";

export function release706Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 706,
    capability: "Fairness and Accessibility Evaluation",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
