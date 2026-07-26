import { json } from "../shared/http";

export const RELEASE_636_STATUS_ROUTE = "/api/v1/programme/636/data-subject-rights-orchestration-v2/status";

export function release636Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 636,
    capability: "Data Subject Rights Orchestration v2",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
