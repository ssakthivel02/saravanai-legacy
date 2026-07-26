import { json } from "../shared/http";

export const RELEASE_831_STATUS_ROUTE = "/api/v1/programme/831/knowledge-source-connector-runtime/status";

export function release831Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 831,
    capability: "Knowledge Source Connector Runtime",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
