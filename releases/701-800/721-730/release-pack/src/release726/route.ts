import { json } from "../shared/http";

export const RELEASE_726_STATUS_ROUTE = "/api/v1/programme/726/content-management-and-publishing-workflow/status";

export function release726Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 726,
    capability: "Content Management and Publishing Workflow",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
