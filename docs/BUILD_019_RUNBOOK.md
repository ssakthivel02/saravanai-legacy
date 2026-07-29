# Build 019 Non-Production Rehearsal and Recovery Runbook

## Prerequisites

- Owner-only Cloudflare Access pilot completed.
- Worker JWT validation healthy.
- Endpoint authorisation proven with unknown-route default denial.
- Dedicated non-production D1 database available.
- Production tenant persistence and server mutations remain disabled.
- Migration 0009 checksum reviewed.
- An owner-approved rollback window exists.

## Rehearsal sequence

1. Export the non-production database and calculate SHA-256.
2. Record row counts and stored bytes by tenant table.
3. Apply migration 0009 only to the non-production database.
4. Verify expected tables, indexes, constraints and schema version.
5. Seed two synthetic tenant profiles with no real email, JWT or profile key.
6. Run all eight tenant-isolation cases.
7. Export the migrated database and record checksum, encryption and counts.
8. Restore the export into a separate non-production database.
9. Compare source and restored checksums, counts, schema and isolation results.
10. Preview an owner-approved deletion request with export and legal-hold checks.
11. Rehearse rollback using disposable non-production resources.
12. Produce evidence digests for all nine rehearsal stages.
13. Review the packet independently and record owner decision.

## Required evidence

- Environment and database identifier classified as non-production.
- Migration 0009 checksum.
- Pre- and post-migration schema inventory.
- Backup checksum, encryption evidence, counts and bytes.
- Restore checksum, integrity result, schema result, RTO and RPO.
- Eight tenant-isolation test results.
- Deletion preview with export and legal-hold evidence.
- Rollback result and residual-risk register.

## Rollback

1. Keep `TENANT_LIFECYCLE_EMERGENCY_STOP` absent or true.
2. Keep all persistence, route mutation and lifecycle approval variables absent.
3. Delete only disposable non-production resources after evidence export.
4. Do not modify the production D1 database.
5. Correct schema or evidence failures in a new rehearsal branch.

## Production prohibition

This runbook does not authorise production migration, backup restoration, hard deletion or server writes. A separate approved production change, verified backup, recovery plan, key-management design and rollback evidence are required.
