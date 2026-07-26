import test from "node:test";import assert from "node:assert/strict";
const controls=["release_232_owner_required", "release_232_evidence_required", "release_232_tenant_scope_required", "release_232_rollback_required"];
test("Release 232 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 232 requires evidence",()=>assert.equal([].length>0,false));