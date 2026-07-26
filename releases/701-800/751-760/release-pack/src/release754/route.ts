import { json } from "../shared/http";

export const RELEASE_754_STATUS_ROUTE = "/api/v1/programme/754/iot-device-identity-and-lifecycle/status";

export function release754Status(requestId: string, traceId: string) {
  return json({
    ok: true,
    release: 754,
    capability: "IoT Device Identity and Lifecycle",
    activation: "disabled_by_default",
    requestId,
    traceId
  });
}
