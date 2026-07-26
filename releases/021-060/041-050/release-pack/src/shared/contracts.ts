export interface ActorContext {
  subject: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  attributes: Record<string, string>;
}
export interface RuntimeContext {
  requestId: string;
  now: string;
  riskScore: number;
  actor?: ActorContext;
  traceId?: string;
}
export interface Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
  decisionId: string;
}
export interface EvidenceReference {
  evidenceId: string;
  type: string;
  uri: string;
  sha256?: string;
  createdAt: string;
}
