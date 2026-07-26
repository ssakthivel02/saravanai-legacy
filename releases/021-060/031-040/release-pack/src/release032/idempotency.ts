export interface IdempotencyRecord{tenantId:string;key:string;operation:string;requestHash:string;status:"started"|"completed"|"failed";responseRef?:string;expiresAt:string;}
export const idempotencyScope=(r:IdempotencyRecord)=>`${r.tenantId}:${r.operation}:${r.key}`;
