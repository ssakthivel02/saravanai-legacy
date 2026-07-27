import test from 'node:test';
import assert from 'node:assert/strict';
import { runFreeResearch, __test } from '../src/free-research.js';

const { cleanResearchQuery, officeHolderQueries, safePublicHttpsUrl, selectCurrentStatement, statementEntityId } = __test;

test('research query cleanup removes courtesy noise without losing the subject', () => {
  assert.equal(cleanResearchQuery('Could you please share Tamil Nadu Chief Minister name?'), 'Tamil Nadu Chief Minister');
  assert.deepEqual(officeHolderQueries('Could you please share Tamil Nadu Chief Minister name?')[0], 'Chief Minister of Tamil Nadu');
});

test('official verification rejects local and private network URLs', () => {
  assert.equal(safePublicHttpsUrl('http://example.com'), '');
  assert.equal(safePublicHttpsUrl('https://localhost/test'), '');
  assert.equal(safePublicHttpsUrl('https://127.0.0.1/test'), '');
  assert.equal(safePublicHttpsUrl('https://192.168.1.10/test'), '');
  assert.equal(safePublicHttpsUrl('https://example.gov.in/path'), 'https://example.gov.in/path');
});

test('current statement selection ignores ended and deprecated office holders', () => {
  const statements = [
    { rank: 'normal', mainsnak: { datavalue: { value: { id: 'Q1' } } }, qualifiers: { P582: [{}] } },
    { rank: 'deprecated', mainsnak: { datavalue: { value: { id: 'Q2' } } } },
    { rank: 'preferred', mainsnak: { datavalue: { value: { id: 'Q3' } } } }
  ];
  const selected = selectCurrentStatement(statements);
  assert.equal(statementEntityId(selected), 'Q3');
});

test('office-holder resolver returns a deterministic cited answer without model synthesis', async () => {
  const fetcher = async (input) => {
    const url = new URL(String(input));
    const action = url.searchParams.get('action');
    if (action === 'wbsearchentities') {
      return new Response(JSON.stringify({ search: [{ id: 'Q100', label: 'Chief Minister of Tamil Nadu' }] }), { status: 200 });
    }
    if (action === 'wbgetentities') {
      const ids = url.searchParams.get('ids');
      if (ids === 'Q100') {
        return new Response(JSON.stringify({ entities: {
          Q100: {
            labels: { en: { value: 'Chief Minister of Tamil Nadu' }, ta: { value: 'தமிழ்நாடு முதலமைச்சர்' } },
            claims: { P1308: [{ rank: 'preferred', mainsnak: { datavalue: { value: { id: 'Q200' } } } }] }
          }
        } }), { status: 200 });
      }
      if (ids === 'Q200') {
        return new Response(JSON.stringify({ entities: {
          Q200: { labels: { en: { value: 'Example Person' }, ta: { value: 'உதாரண நபர்' } }, claims: {} }
        } }), { status: 200 });
      }
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await runFreeResearch('Who is the current Tamil Nadu Chief Minister?', {}, { fetcher });
  assert.equal(result.provider, 'free-research-wikidata');
  assert.match(result.answer, /Example Person/);
  assert.equal(result.citations.length, 2);
});
