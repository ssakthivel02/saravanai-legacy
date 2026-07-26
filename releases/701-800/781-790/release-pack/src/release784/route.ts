import { json } from "../shared/http";

export const RELEASE_784_STATUS_ROUTE = "/api/v1/programme/784/enterprise-risk-and-opportunity-portfolio/status";

export function release784Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 784,
    capability: "Enterprise Risk and Opportunity Portfolio",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
