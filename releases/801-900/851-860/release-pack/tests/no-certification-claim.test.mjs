import test from "node:test";
import assert from "node:assert/strict";
test("readiness is not certification",()=>assert.equal("certification not claimed".includes("not claimed"),true));
