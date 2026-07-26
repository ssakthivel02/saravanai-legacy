import { json } from "../shared/http";

export const RELEASE_684_STATUS_ROUTE = "/api/v1/programme/684/control-effectiveness-assessment/status";

export function release684Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 684,
    capability: "Control Effectiveness Assessment",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
