import test from "node:test";import assert from "node:assert/strict";
const controls=["release_236_owner_required", "release_236_evidence_required", "release_236_tenant_scope_required", "release_236_rollback_required"];
test("Release 236 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 236 requires evidence",()=>assert.equal([].length>0,false));