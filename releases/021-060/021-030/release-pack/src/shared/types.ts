export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export interface RequestContext {
  requestId: string;
  now: string;
  actor?: {
    subject: string;
    email?: string;
    tenantId?: string;
    roles: string[];
    attributes: Record<string, string>;
  };
  riskScore: number;
}

export interface Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
  decisionId: string;
}
