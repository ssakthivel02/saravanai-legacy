import { json } from "../shared/http";

export const RELEASE_613_STATUS_ROUTE = "/api/v1/programme/613/tool-catalogue-and-capability-manifest/status";

export function release613Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 613,
    capability: "Tool Catalogue and Capability Manifest",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
