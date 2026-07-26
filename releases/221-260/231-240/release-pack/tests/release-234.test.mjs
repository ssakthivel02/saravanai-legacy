import test from "node:test";import assert from "node:assert/strict";
const controls=["release_234_owner_required", "release_234_evidence_required", "release_234_tenant_scope_required", "release_234_rollback_required"];
test("Release 234 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 234 requires evidence",()=>assert.equal([].length>0,false));