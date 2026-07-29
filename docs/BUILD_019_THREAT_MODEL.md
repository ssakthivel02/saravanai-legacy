# Build 019 Threat Model

## Protected assets

- Tenant-isolated records and pseudonymous tenant context.
- Migration, backup, restore and deletion evidence.
- Recovery objectives, approval state and rollback evidence.
- Free-first cost and activation controls.

## Threats and controls

| Threat | Control |
|---|---|
| Production database is used for rehearsal | Environment must be local, preview or non-production; production blocks. |
| Migration is applied automatically | No migration runner exists; migrations 0009 and 0010 are manual design artefacts. |
| Backup corruption is unnoticed | SHA-256, encryption, timestamp, count and byte evidence are required. |
| Restore silently loses or mixes data | Digest match, schema, integrity and tenant-isolation results must pass. |
| Cross-tenant access is overlooked | Eight explicit allow/deny cases are mandatory. |
| Browser supplies another tenant ID | Build 018 derives tenant context server-side; override evidence must pass as ignored. |
| Deletion bypasses legal hold | Active legal hold always blocks the evidence gate. |
| Records are destroyed without export | Export-completed evidence is mandatory before deletion review. |
| Approval variables are partially enabled | Every evidence approval plus lifecycle enablement and emergency-stop release is required. |
| Evidence endpoint leaks identity or backup content | Only metadata summaries are returned; evidence bodies are not persisted or exposed. |
| Recovery enables surprise cost | No paid recovery service, paid overage or silent paid fallback is supported. |
| A green readiness state is mistaken for production permission | Every contract explicitly reports production actions as prohibited. |

## Residual risks

- Evidence authenticity is not cryptographically attested by an external system.
- No real D1 backup or restore has been executed by Build 019.
- Key-management and encrypted payload implementation remain future work.
- Recovery objectives have not been proven against production-scale data.
- Cloudflare Access and endpoint authorisation remain manual activation dependencies.

These residual risks prohibit production write, migration, restore and deletion activation.
