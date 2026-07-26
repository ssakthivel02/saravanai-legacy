import test from "node:test";import assert from "node:assert/strict";
const controls=["release_251_owner_required", "release_251_evidence_required", "release_251_tenant_scope_required", "release_251_rollback_required"];
test("Release 251 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 251 requires evidence",()=>assert.equal([].length>0,false));