import { json } from "../shared/http";

export const RELEASE_649_STATUS_ROUTE = "/api/v1/programme/649/content-distribution-and-withdrawal/status";

export function release649Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 649,
    capability: "Content Distribution and Withdrawal",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
