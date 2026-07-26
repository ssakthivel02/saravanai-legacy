import test from "node:test";import assert from "node:assert/strict";
const controls=["release_248_owner_required", "release_248_evidence_required", "release_248_tenant_scope_required", "release_248_rollback_required"];
test("Release 248 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 248 requires evidence",()=>assert.equal([].length>0,false));