export type DataSensitivity = "public" | "internal" | "confidential" | "restricted";

export interface TrustedActor {
  subject: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  mfaVerified: boolean;
}

export interface RuntimeContext {
  requestId: string;
  traceId: string;
  now: string;
  actor?: TrustedActor;
  riskScore: number;
}

export interface ControlDecision {
  allowed: boolean;
  reason: string;
  obligations: string[];
  evidenceIds: string[];
}
