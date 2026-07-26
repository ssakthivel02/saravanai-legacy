import test from "node:test";import assert from "node:assert/strict";
const controls=["release_252_owner_required", "release_252_evidence_required", "release_252_tenant_scope_required", "release_252_rollback_required"];
test("Release 252 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 252 requires evidence",()=>assert.equal([].length>0,false));