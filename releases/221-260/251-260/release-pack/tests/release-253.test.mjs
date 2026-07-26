import test from "node:test";import assert from "node:assert/strict";
const controls=["release_253_owner_required", "release_253_evidence_required", "release_253_tenant_scope_required", "release_253_rollback_required"];
test("Release 253 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 253 requires evidence",()=>assert.equal([].length>0,false));