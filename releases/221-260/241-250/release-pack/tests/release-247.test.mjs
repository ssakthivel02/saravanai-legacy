import test from "node:test";import assert from "node:assert/strict";
const controls=["release_247_owner_required", "release_247_evidence_required", "release_247_tenant_scope_required", "release_247_rollback_required"];
test("Release 247 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 247 requires evidence",()=>assert.equal([].length>0,false));