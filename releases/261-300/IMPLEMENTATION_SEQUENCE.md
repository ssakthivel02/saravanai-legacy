# Implementation sequence

1. Merge the design packs without runtime activation.
2. Select one capability for a dedicated implementation pull request.
3. Review identity, tenant, threat, privacy, accessibility and rollback dependencies.
4. Apply migrations only to non-production D1.
5. Test positive, negative, tenant-isolation, correction and recovery paths.
6. Release behind a disabled-by-default feature flag.
7. Pilot with evidence.
8. Expand only after an accountable go/no-go decision.
