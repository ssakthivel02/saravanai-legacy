export interface Release130Record {
  recordId:string;
  tenantId:string;
  ownerSubject:string;
  status:"draft"|"review"|"approved"|"retired";
  evidenceRefs:string[];
  riskScore:number;
  createdAt:string;
  updatedAt:string;
}
export const RELEASE_130_RULES=["default_deny", "evidence_integrity", "go_no_go_required", "human_accountability", "local_review", "regional_profile_required", "residual_risks_recorded", "rollback_ready", "safe_telemetry", "tenant_scope", "trusted_identity"] as const;
export function validateRelease130Record(v:Release130Record):string[] { const e:string[]=[]; if(!v.recordId.trim())e.push("record_id_required"); if(!v.tenantId.trim())e.push("tenant_required"); if(!v.ownerSubject.trim())e.push("owner_required"); if(v.riskScore<0||v.riskScore>100)e.push("risk_score_out_of_range"); if(v.status==="approved"&&!v.evidenceRefs.length)e.push("approved_evidence_required"); return e; }
