export interface Release253Record {
  recordId:string; tenantId:string; owner:string; status:"draft"|"approved"|"retired";
  evidenceRefs:string[]; riskScore:number; createdAt:string; updatedAt:string;
}
export const RELEASE_253_CONTROLS=["release_253_owner_required", "release_253_evidence_required", "release_253_tenant_scope_required", "release_253_rollback_required"] as const;
export function validateRelease253(v:Release253Record):string[]{
 const e:string[]=[]; if(!v.recordId)e.push("record_id_required"); if(!v.tenantId)e.push("tenant_required");
 if(!v.owner)e.push("owner_required"); if(!v.evidenceRefs.length)e.push("evidence_required");
 if(v.riskScore<0||v.riskScore>100)e.push("risk_out_of_range"); return [...new Set(e)];
}