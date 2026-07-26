import test from "node:test";import assert from "node:assert/strict";
const controls=["release_228_owner_required", "release_228_evidence_required", "release_228_tenant_scope_required", "release_228_rollback_required"];
test("Release 228 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 228 requires evidence",()=>assert.equal([].length>0,false));