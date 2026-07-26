import test from "node:test";
import assert from "node:assert/strict";
const valid=a=>Boolean(a.originalDecisionId)&&Boolean(a.independentReviewer)&&a.evidenceRefs.length>0;
test("appeal needs original decision independent reviewer and evidence",()=>assert.equal(valid({originalDecisionId:"d",independentReviewer:"r",evidenceRefs:["e"]}),true));
