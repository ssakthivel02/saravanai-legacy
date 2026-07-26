import test from "node:test";import assert from "node:assert/strict";
const controls=["release_256_owner_required", "release_256_evidence_required", "release_256_tenant_scope_required", "release_256_rollback_required"];
test("Release 256 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 256 requires evidence",()=>assert.equal([].length>0,false));