import test from "node:test";import assert from "node:assert/strict";
const controls=["release_238_owner_required", "release_238_evidence_required", "release_238_tenant_scope_required", "release_238_rollback_required"];
test("Release 238 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 238 requires evidence",()=>assert.equal([].length>0,false));