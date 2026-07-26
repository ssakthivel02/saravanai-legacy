export interface Release858Telemetry {
  requestId: string;
  traceId: string;
  tenantId: string;
  action: string;
  outcome: "allowed" | "denied" | "failed";
  durationMs: number;
  occurredAt: string;
}

export const RELEASE_858_FORBIDDEN_LOG_FIELDS = [
  "prompt", "content", "document", "file", "email", "phone", "secret", "token"
] as const;
