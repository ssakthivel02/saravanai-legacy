import type { Release103Record } from "./contracts";
import type { PolicyDecision } from "../shared/decision";
export function evaluateRelease103(v:Release103Record):PolicyDecision {
  if(v.riskScore>=70) return {allowed:false,reason:"high_risk_human_review",obligations:["independent_approval","retain_evidence"]};
  if(v.status==="approved"&&!v.evidenceRefs.length) return {allowed:false,reason:"evidence_required",obligations:["block_activation"]};
  return {allowed:true,reason:"release_103_policy_satisfied",obligations:["audit_decision","tenant_scope"]};
}
