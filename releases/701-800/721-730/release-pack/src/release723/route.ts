import { json } from "../shared/http";

export const RELEASE_723_STATUS_ROUTE = "/api/v1/programme/723/website-and-web-application-scaffold/status";

export function release723Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 723,
    capability: "Website and Web Application Scaffold",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
