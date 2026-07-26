export interface ApprovalEvidence { approvalId:string; requestedBy:string; decidedBy:string; decision:"approved"|"rejected"; expiresAt:string; evidenceRefs:string[]; }
export function validFourEyes(v:ApprovalEvidence,now=Date.now()):boolean { return v.decision==="approved" && v.requestedBy!==v.decidedBy && v.evidenceRefs.length>0 && new Date(v.expiresAt).getTime()>now; }
