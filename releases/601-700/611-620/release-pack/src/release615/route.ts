import { json } from "../shared/http";

export const RELEASE_615_STATUS_ROUTE = "/api/v1/programme/615/agent-sandbox-and-resource-isolation/status";

export function release615Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 615,
    capability: "Agent Sandbox and Resource Isolation",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
