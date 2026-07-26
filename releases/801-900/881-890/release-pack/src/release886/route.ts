import { json } from "../shared/http";

export const RELEASE_886_STATUS_ROUTE = "/api/v1/programme/886/energy-carbon-and-sustainability-measurement/status";

export function release886Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 886,
    capability: "Energy Carbon and Sustainability Measurement",
    implementationState: "blueprint",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
