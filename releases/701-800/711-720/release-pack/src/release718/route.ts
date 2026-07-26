import { json } from "../shared/http";

export const RELEASE_718_STATUS_ROUTE = "/api/v1/programme/718/research-report-and-briefing-composer/status";

export function release718Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 718,
    capability: "Research Report and Briefing Composer",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
