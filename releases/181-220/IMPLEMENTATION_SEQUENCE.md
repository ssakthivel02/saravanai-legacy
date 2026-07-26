# Implementation sequence

1. Merge the design packs without activating runtime routes.
2. Review cross-release dependencies and select one capability at a time.
3. Create a separate implementation PR for each production capability.
4. Apply migrations to a non-production D1 database.
5. Run tenant-isolation, policy, security and rollback tests.
6. Collect go/no-go evidence and obtain owner approval.
7. Release behind a disabled-by-default feature flag.
8. Expand only after monitored pilot evidence is satisfactory.
