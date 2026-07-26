export interface Release855Telemetry {
  requestId: string;
  traceId: string;
  tenantId: string;
  action: string;
  outcome: "allowed" | "denied" | "failed";
  durationMs: number;
  occurredAt: string;
}

export const RELEASE_855_FORBIDDEN_LOG_FIELDS = [
  "prompt", "content", "document", "file", "email", "phone", "secret", "token"
] as const;
