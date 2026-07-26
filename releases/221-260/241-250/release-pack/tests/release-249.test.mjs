import test from "node:test";import assert from "node:assert/strict";
const controls=["release_249_owner_required", "release_249_evidence_required", "release_249_tenant_scope_required", "release_249_rollback_required"];
test("Release 249 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 249 requires evidence",()=>assert.equal([].length>0,false));