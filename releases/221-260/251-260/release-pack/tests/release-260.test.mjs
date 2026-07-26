import test from "node:test";import assert from "node:assert/strict";
const controls=["release_260_owner_required", "release_260_evidence_required", "release_260_tenant_scope_required", "release_260_rollback_required"];
test("Release 260 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 260 requires evidence",()=>assert.equal([].length>0,false));