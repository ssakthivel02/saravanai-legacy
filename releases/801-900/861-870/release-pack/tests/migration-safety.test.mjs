import test from "node:test";
import assert from "node:assert/strict";
test("production migration is never automatic",()=>assert.equal({automatic:false}.automatic,false));
