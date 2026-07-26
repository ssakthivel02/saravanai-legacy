import type { Release127Record } from "./contracts";
import type { PolicyDecision } from "../shared/decision";
export function evaluateRelease127(v:Release127Record):PolicyDecision {
  if(v.riskScore>=70) return {allowed:false,reason:"high_risk_human_review",obligations:["independent_approval","retain_evidence"]};
  if(v.status==="approved"&&!v.evidenceRefs.length) return {allowed:false,reason:"evidence_required",obligations:["block_activation"]};
  return {allowed:true,reason:"release_127_policy_satisfied",obligations:["audit_decision","tenant_scope"]};
}
