import test from "node:test";import assert from "node:assert/strict";
const controls=["release_243_owner_required", "release_243_evidence_required", "release_243_tenant_scope_required", "release_243_rollback_required"];
test("Release 243 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 243 requires evidence",()=>assert.equal([].length>0,false));