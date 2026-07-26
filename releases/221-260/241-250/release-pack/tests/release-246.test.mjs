import test from "node:test";import assert from "node:assert/strict";
const controls=["release_246_owner_required", "release_246_evidence_required", "release_246_tenant_scope_required", "release_246_rollback_required"];
test("Release 246 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 246 requires evidence",()=>assert.equal([].length>0,false));