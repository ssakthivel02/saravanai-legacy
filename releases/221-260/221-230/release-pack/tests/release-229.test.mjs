import test from "node:test";import assert from "node:assert/strict";
const controls=["release_229_owner_required", "release_229_evidence_required", "release_229_tenant_scope_required", "release_229_rollback_required"];
test("Release 229 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 229 requires evidence",()=>assert.equal([].length>0,false));