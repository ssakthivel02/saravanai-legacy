# Implementation sequence

1. Complete and merge Releases 221–260.
2. Complete and merge Releases 261–300.
3. Merge Releases 301–400 as reviewed design foundations.
4. Select one capability and create a separate runtime implementation PR.
5. Review identity, tenant, threat, privacy, accessibility, cost and rollback.
6. Apply D1 migrations only in non-production.
7. Run positive, negative, tenant-isolation and recovery tests.
8. Pilot behind a disabled-by-default feature flag.
9. Expand only after accountable go/no-go evidence.
