import { json } from "../shared/http";

export const RELEASE_711_STATUS_ROUTE = "/api/v1/programme/711/research-question-and-scope-registry/status";

export function release711Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 711,
    capability: "Research Question and Scope Registry",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
