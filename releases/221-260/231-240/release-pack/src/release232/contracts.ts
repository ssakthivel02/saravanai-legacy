export interface Release232Record {
  recordId:string; tenantId:string; owner:string; status:"draft"|"approved"|"retired";
  evidenceRefs:string[]; riskScore:number; createdAt:string; updatedAt:string;
}
export const RELEASE_232_CONTROLS=["release_232_owner_required", "release_232_evidence_required", "release_232_tenant_scope_required", "release_232_rollback_required"] as const;
export function validateRelease232(v:Release232Record):string[]{
 const e:string[]=[]; if(!v.recordId)e.push("record_id_required"); if(!v.tenantId)e.push("tenant_required");
 if(!v.owner)e.push("owner_required"); if(!v.evidenceRefs.length)e.push("evidence_required");
 if(v.riskScore<0||v.riskScore>100)e.push("risk_out_of_range"); return [...new Set(e)];
}