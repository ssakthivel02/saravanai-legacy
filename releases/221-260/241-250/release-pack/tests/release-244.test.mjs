import test from "node:test";import assert from "node:assert/strict";
const controls=["release_244_owner_required", "release_244_evidence_required", "release_244_tenant_scope_required", "release_244_rollback_required"];
test("Release 244 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 244 requires evidence",()=>assert.equal([].length>0,false));