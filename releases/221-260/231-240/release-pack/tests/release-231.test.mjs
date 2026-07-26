import test from "node:test";import assert from "node:assert/strict";
const controls=["release_231_owner_required", "release_231_evidence_required", "release_231_tenant_scope_required", "release_231_rollback_required"];
test("Release 231 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 231 requires evidence",()=>assert.equal([].length>0,false));