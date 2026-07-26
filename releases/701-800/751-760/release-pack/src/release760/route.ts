import { json } from "../shared/http";

export const RELEASE_760_STATUS_ROUTE = "/api/v1/programme/760/ot-edge-and-iot-assurance-gate/status";

export function release760Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 760,
    capability: "OT Edge and IoT Assurance Gate",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
