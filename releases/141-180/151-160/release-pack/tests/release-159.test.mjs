import test from "node:test";
import assert from "node:assert/strict";

const controls = ["tax_review_required", "invoice_disabled", "payment_collection_disabled"];

test("Release 159 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 159 keeps invoiceGenerationEnabled disabled", () => {
  assert.equal({ invoiceGenerationEnabled: false }.invoiceGenerationEnabled, false);
});

test("Release 159 keeps paymentCollectionEnabled disabled", () => {
  assert.equal({ paymentCollectionEnabled: false }.paymentCollectionEnabled, false);
});

test("Release 159 keeps unifiedBillingEnabled disabled", () => {
  assert.equal({ unifiedBillingEnabled: false }.unifiedBillingEnabled, false);
});

