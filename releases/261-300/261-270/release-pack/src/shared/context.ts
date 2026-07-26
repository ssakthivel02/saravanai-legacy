export interface RuntimeContext {
  requestId: string;
  traceId: string;
  tenantId: string;
  actorSubject: string;
  roles: string[];
  permissions: string[];
  riskScore: number;
  now: string;
}
