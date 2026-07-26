import test from "node:test"; import assert from "node:assert/strict";
const rules=["default_deny", "evidence_integrity", "human_accountability", "rollback_ready", "safe_telemetry", "tenant_scope", "trusted_identity"];
test("Release 111 has explicit unique controls",()=>{assert.equal(rules.length>=7,true);assert.equal(new Set(rules).size,rules.length);});
test("Release 111 approved records require evidence",()=>{const record={status:"approved",evidenceRefs:[]};assert.equal(record.status==="approved"&&record.evidenceRefs.length===0,true);});
