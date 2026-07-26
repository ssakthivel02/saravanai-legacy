import { json } from "../shared/http";

export const RELEASE_762_STATUS_ROUTE = "/api/v1/programme/762/landing-zone-and-account-subscription-factory/status";

export function release762Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 762,
    capability: "Landing Zone and Account Subscription Factory",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
