import { json } from "../shared/http";

export const RELEASE_660_STATUS_ROUTE = "/api/v1/programme/660/secure-developer-platform-assurance-gate/status";

export function release660Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 660,
    capability: "Secure Developer Platform Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
