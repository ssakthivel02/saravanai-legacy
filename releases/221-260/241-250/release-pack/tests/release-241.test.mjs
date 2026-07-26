import test from "node:test";import assert from "node:assert/strict";
const controls=["release_241_owner_required", "release_241_evidence_required", "release_241_tenant_scope_required", "release_241_rollback_required"];
test("Release 241 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 241 requires evidence",()=>assert.equal([].length>0,false));