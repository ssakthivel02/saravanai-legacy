import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createOwnerLockVerifier,
  decryptOwnerBackup,
  encryptOwnerBackup,
  verifyOwnerPassphrase
} from '../assets/owner-security.js';

const passphrase = 'SakthiAI-owner-passphrase-2026';

test('owner lock verifier accepts the correct passphrase and rejects another', async () => {
  const configuration = await createOwnerLockVerifier(passphrase, new Uint8Array(16).fill(7));
  assert.equal(await verifyOwnerPassphrase(passphrase, configuration), true);
  assert.equal(await verifyOwnerPassphrase('incorrect-passphrase-value', configuration), false);
  assert.equal(configuration.verifier.includes(passphrase), false);
});

test('encrypted backup uses AES-GCM envelope and round-trips Unicode content', async () => {
  const payload = {
    project: 'SakthiAI',
    tamil: 'வணக்கம்',
    data: [{ type: 'memory', value: 'owner approved' }]
  };
  const envelope = await encryptOwnerBackup(payload, passphrase);
  assert.equal(envelope.format, 'sakthiai-encrypted-backup-v1');
  assert.equal(envelope.cipher, 'AES-256-GCM');
  assert.equal(JSON.stringify(envelope).includes('வணக்கம்'), false);
  assert.deepEqual(await decryptOwnerBackup(envelope, passphrase), payload);
  await assert.rejects(() => decryptOwnerBackup(envelope, 'wrong-passphrase-value'), /operation|decrypt|failed/i);
});

test('short passphrases are refused', async () => {
  await assert.rejects(() => createOwnerLockVerifier('short'), /at least 12/);
  await assert.rejects(() => encryptOwnerBackup({ test: true }, 'short'), /at least 12/);
});
