# Build 018 Threat Model

## Assets

- Tenant-isolated project, conversation, artifact, approval, memory and usage records.
- Pseudonymous tenant and actor identifiers.
- Encryption metadata, quota counters, deletion requests and migration evidence.

## Primary threats and controls

### Browser-supplied tenant identifier

Threat: an attacker changes a tenant ID to access another profile.

Control: the Worker derives the tenant ID only from the cryptographically verified profile key. Browser tenant identifiers are ignored.

### Cross-tenant query or insecure direct object reference

Threat: a record ID from another tenant is queried directly.

Control: every query binds both tenant ID and record ID; unclassified routes default to deny when Build 017 enforcement is active.

### Identity leakage

Threat: readiness endpoints reveal email, JWT, Access audience or raw profile key.

Control: API contracts expose only booleans, releases, counts and activation states.

### Plaintext sensitive-data storage

Threat: content is written to D1 in readable form.

Control: migration schema requires ciphertext, nonce, checksum and key version; Build 018 implements no write path.

### Partial activation

Threat: persistence is enabled without identity, authorisation, schema or emergency controls.

Control: reads require the complete gate chain; writes add independent mutation and tenant-write gates.

### Quota bypass and surprise cost

Threat: excessive records or bytes cause abuse or unexpected charges.

Control: bounded quota contracts, no paid overage and no silent paid fallback. Hard enforcement remains disabled until usage counters are validated.

### Destructive deletion

Threat: records are deleted accidentally or maliciously.

Control: deletion is request-based, owner-approved and preview-only; automatic purge and hard delete are not implemented.

### Migration failure

Threat: schema changes corrupt production data.

Control: migration 0009 is manual, requires backup/export, checksum evidence, non-production rehearsal and rollback approval.

## Residual risks

- Application-level encryption key lifecycle is not yet implemented.
- D1 backup and restore evidence is not yet captured.
- Cross-device synchronisation is not active.
- Server write, deletion and shared-team flows are intentionally incomplete.

These residual risks prevent production write activation.