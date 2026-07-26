import { json } from "../shared/http";

export const RELEASE_748_STATUS_ROUTE = "/api/v1/programme/748/skills-taxonomy-and-role-mapping/status";

export function release748Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 748,
    capability: "Skills Taxonomy and Role Mapping",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
