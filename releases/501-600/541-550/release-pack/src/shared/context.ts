export interface RuntimeContext {
  requestId: string;
  traceId: string;
  tenantId: string;
  actorSubject: string;
  roles: string[];
  permissions: string[];
  authenticationStrength: "single_factor" | "mfa" | "phishing_resistant";
  riskScore: number;
  locale: string;
  now: string;
}
