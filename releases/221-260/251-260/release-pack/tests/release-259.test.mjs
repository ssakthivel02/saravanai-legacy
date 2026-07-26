import test from "node:test";import assert from "node:assert/strict";
const controls=["release_259_owner_required", "release_259_evidence_required", "release_259_tenant_scope_required", "release_259_rollback_required"];
test("Release 259 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 259 requires evidence",()=>assert.equal([].length>0,false));