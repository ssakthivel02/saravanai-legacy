import { json } from "../shared/http";

export const RELEASE_869_STATUS_ROUTE = "/api/v1/programme/869/regional-incident-notification-and-support/status";

export function release869Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 869,
    capability: "Regional Incident Notification and Support",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
