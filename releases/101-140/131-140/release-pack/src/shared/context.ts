export interface ActorContext { subject:string; tenantId:string; roles:string[]; permissions:string[]; authenticationStrength:"single_factor"|"mfa"|"phishing_resistant"; }
export interface RuntimeContext { requestId:string; traceId:string; now:string; actor?:ActorContext; riskScore:number; }
