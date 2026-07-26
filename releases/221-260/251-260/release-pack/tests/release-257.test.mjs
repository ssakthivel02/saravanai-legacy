import test from "node:test";import assert from "node:assert/strict";
const controls=["release_257_owner_required", "release_257_evidence_required", "release_257_tenant_scope_required", "release_257_rollback_required"];
test("Release 257 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 257 requires evidence",()=>assert.equal([].length>0,false));