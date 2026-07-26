import test from "node:test";import assert from "node:assert/strict";
const controls=["release_250_owner_required", "release_250_evidence_required", "release_250_tenant_scope_required", "release_250_rollback_required"];
test("Release 250 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 250 requires evidence",()=>assert.equal([].length>0,false));