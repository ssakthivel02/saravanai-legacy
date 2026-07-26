export interface Release861Telemetry {
  requestId: string;
  traceId: string;
  tenantId: string;
  action: string;
  outcome: "allowed" | "denied" | "failed";
  durationMs: number;
  occurredAt: string;
}

export const RELEASE_861_FORBIDDEN_LOG_FIELDS = [
  "prompt", "content", "document", "file", "email", "phone", "secret", "token"
] as const;
