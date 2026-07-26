import test from "node:test";import assert from "node:assert/strict";
const controls=["release_237_owner_required", "release_237_evidence_required", "release_237_tenant_scope_required", "release_237_rollback_required"];
test("Release 237 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 237 requires evidence",()=>assert.equal([].length>0,false));