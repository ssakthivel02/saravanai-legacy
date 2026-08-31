export interface BreakGlassRequest{requestId:string;actorSubject:string;reason:string;expiresAt:string;approvedBy?:string;}
export const isBreakGlassActive=(r:BreakGlassRequest,now=Date.now())=>Boolean(r.approvedBy)&&new Date(r.expiresAt).getTime()>now;
