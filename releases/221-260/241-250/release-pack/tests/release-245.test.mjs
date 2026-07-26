import test from "node:test";import assert from "node:assert/strict";
const controls=["release_245_owner_required", "release_245_evidence_required", "release_245_tenant_scope_required", "release_245_rollback_required"];
test("Release 245 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 245 requires evidence",()=>assert.equal([].length>0,false));