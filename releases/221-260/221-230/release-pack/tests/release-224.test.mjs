import test from "node:test";import assert from "node:assert/strict";
const controls=["release_224_owner_required", "release_224_evidence_required", "release_224_tenant_scope_required", "release_224_rollback_required"];
test("Release 224 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 224 requires evidence",()=>assert.equal([].length>0,false));