import { json } from "../shared/http";

export const RELEASE_701_STATUS_ROUTE = "/api/v1/programme/701/ai-evaluation-dataset-registry/status";

export function release701Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 701,
    capability: "AI Evaluation Dataset Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
