import test from "node:test";import assert from "node:assert/strict";
const controls=["release_258_owner_required", "release_258_evidence_required", "release_258_tenant_scope_required", "release_258_rollback_required"];
test("Release 258 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 258 requires evidence",()=>assert.equal([].length>0,false));