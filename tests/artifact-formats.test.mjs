import test from 'node:test';
import assert from 'node:assert/strict';
import { createCodeZip, createDocx, createPptx, createTextArtifact, createXlsx } from '../assets/artifact-formats.js';

async function startsWithZip(blob) {
  const bytes = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
  return [...bytes];
}

for (const [name, factory] of [
  ['DOCX', createDocx],
  ['XLSX', createXlsx],
  ['PPTX', createPptx],
  ['code ZIP', createCodeZip]
]) {
  test(`${name} generator creates a ZIP package locally`, async () => {
    const blob = factory('Owner test', 'Line one\nLine two');
    assert.ok(blob.size > 100);
    assert.deepEqual(await startsWithZip(blob), [0x50, 0x4b, 0x03, 0x04]);
  });
}

test('text artifact generator preserves Unicode content', async () => {
  const blob = createTextArtifact('markdown', 'தமிழ்', 'வணக்கம் SakthiAI');
  const text = await blob.text();
  assert.match(text, /வணக்கம்/);
  assert.match(text, /SakthiAI/);
});
