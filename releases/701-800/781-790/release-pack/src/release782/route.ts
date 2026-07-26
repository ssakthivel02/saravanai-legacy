import { json } from "../shared/http";

export const RELEASE_782_STATUS_ROUTE = "/api/v1/programme/782/portfolio-investment-and-capacity-planning/status";

export function release782Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 782,
    capability: "Portfolio Investment and Capacity Planning",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
