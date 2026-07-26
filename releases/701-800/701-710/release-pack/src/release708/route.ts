import { json } from "../shared/http";

export const RELEASE_708_STATUS_ROUTE = "/api/v1/programme/708/model-regression-and-release-comparison/status";

export function release708Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 708,
    capability: "Model Regression and Release Comparison",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
