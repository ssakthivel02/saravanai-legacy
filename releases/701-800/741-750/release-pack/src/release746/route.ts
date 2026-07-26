import { json } from "../shared/http";

export const RELEASE_746_STATUS_ROUTE = "/api/v1/programme/746/career-profile-resume-and-portfolio-composer/status";

export function release746Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 746,
    capability: "Career Profile Resume and Portfolio Composer",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
