import { json } from "../shared/http";

export const RELEASE_733_STATUS_ROUTE = "/api/v1/programme/733/calendar-scheduling-and-meeting-coordination/status";

export function release733Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 733,
    capability: "Calendar Scheduling and Meeting Coordination",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
