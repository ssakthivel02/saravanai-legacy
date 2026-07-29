# Build 019 Architecture — HLD and LLD

## High-level flow

1. Build 018 derives a pseudonymous tenant context from a cryptographically verified Access identity.
2. Build 017 classifies the request and enforces least-privilege route policy when activated.
3. Build 019 accepts only caller-supplied, non-production evidence metadata.
4. Deterministic validators assess migration rehearsal, backup, restore, tenant isolation and deletion evidence.
5. `tenant-recovery-policy.js` requires five independent evidence approvals plus an explicit lifecycle gate and released emergency stop.
6. The API returns readiness state only; it performs no D1 write, migration, backup, restore or deletion.

## Components

- `tenant-rehearsal-plan.js`: required rehearsal stages and evidence digests.
- `tenant-backup-contract.js`: export integrity and encryption evidence.
- `tenant-restore-contract.js`: restore integrity, isolation, RTO and RPO evidence.
- `tenant-isolation-assurance.js`: cross-tenant denial test matrix.
- `tenant-deletion-assurance.js`: legal-hold, export and owner-approval controls.
- `tenant-recovery-policy.js`: fail-closed activation state.
- `platform-release-019.js`: safe platform and lifecycle readiness projection.
- `tenant-lifecycle.js`: owner dashboard with no identity disclosure.

## Trust boundaries

- Browser input is untrusted and cannot specify production eligibility.
- Environment values must identify local, preview or non-production use.
- Evidence digests are syntax-validated only; Build 019 does not fetch or persist evidence.
- Runtime cannot create backups, restore databases, apply migrations or delete records.
- Approval variables represent a future manual evidence decision and remain absent in repository defaults.

## Data minimisation

Readiness responses expose release names, booleans, counts, required stages and activation state. They do not expose email, subject, JWT, Access audience, raw profile key, tenant ID, record content, backup bytes or evidence bodies.

## Failure model

Any missing stage, failed result, invalid digest, production environment, legal hold, checksum mismatch, isolation failure or incomplete approval chain results in a blocking decision. Emergency stop defaults to active.
