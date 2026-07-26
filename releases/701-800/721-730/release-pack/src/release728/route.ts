import { json } from "../shared/http";

export const RELEASE_728_STATUS_ROUTE = "/api/v1/programme/728/application-quality-security-and-accessibility-testing/status";

export function release728Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 728,
    capability: "Application Quality Security and Accessibility Testing",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
