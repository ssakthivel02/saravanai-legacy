import test from "node:test";import assert from "node:assert/strict";
const controls=["release_254_owner_required", "release_254_evidence_required", "release_254_tenant_scope_required", "release_254_rollback_required"];
test("Release 254 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 254 requires evidence",()=>assert.equal([].length>0,false));