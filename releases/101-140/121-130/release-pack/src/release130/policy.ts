import type { Release130Record } from "./contracts";
import type { PolicyDecision } from "../shared/decision";
export function evaluateRelease130(v:Release130Record):PolicyDecision {
  if(v.riskScore>=70) return {allowed:false,reason:"high_risk_human_review",obligations:["independent_approval","retain_evidence"]};
  if(v.status==="approved"&&!v.evidenceRefs.length) return {allowed:false,reason:"evidence_required",obligations:["block_activation"]};
  return {allowed:true,reason:"release_130_policy_satisfied",obligations:["audit_decision","tenant_scope"]};
}
