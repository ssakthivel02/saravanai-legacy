import { json } from "../shared/http";

export const RELEASE_614_STATUS_ROUTE = "/api/v1/programme/614/tool-invocation-gateway/status";

export function release614Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 614,
    capability: "Tool Invocation Gateway",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
