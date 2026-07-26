# Implementation sequence

1. Merge Releases 601–700 as reviewed foundations.
2. Select one capability for a dedicated implementation PR.
3. Review identity, tenant, threat, privacy, accessibility, cost and rollback.
4. Apply D1 migrations only in non-production.
5. Run positive, negative, tenant-isolation and recovery tests.
6. Pilot behind a disabled-by-default feature flag and tenant allowlist.
7. Collect operational evidence.
8. Expand only after accountable go/no-go approval.
