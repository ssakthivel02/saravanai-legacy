import { json } from "../shared/http";

export const RELEASE_602_STATUS_ROUTE = "/api/v1/programme/602/provider-and-model-adapter-contract/status";

export function release602Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 602,
    capability: "Provider and Model Adapter Contract",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
