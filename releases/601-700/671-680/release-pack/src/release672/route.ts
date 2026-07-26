import { json } from "../shared/http";

export const RELEASE_672_STATUS_ROUTE = "/api/v1/programme/672/workflow-definition-and-version-control/status";

export function release672Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 672,
    capability: "Workflow Definition and Version Control",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
