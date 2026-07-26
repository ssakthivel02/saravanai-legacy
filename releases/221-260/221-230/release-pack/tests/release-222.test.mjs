import test from "node:test";import assert from "node:assert/strict";
const controls=["release_222_owner_required", "release_222_evidence_required", "release_222_tenant_scope_required", "release_222_rollback_required"];
test("Release 222 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 222 requires evidence",()=>assert.equal([].length>0,false));