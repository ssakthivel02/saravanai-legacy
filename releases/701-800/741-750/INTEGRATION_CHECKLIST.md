# Integration checklist

- [ ] Releases 601–700 are merged into `main`.
- [ ] Branch `feature/releases-701-800-enterprise-v7` is selected.
- [ ] Pack is under `releases/701-800/741-750/`.
- [ ] Existing SakthiAI validation passes.
- [ ] Pack validator and unit tests pass.
- [ ] Tenant-isolation and four-eyes tests pass.
- [ ] D1 migrations are reviewed only in non-production.
- [ ] Threat, privacy, accessibility, cost and resilience reviews pass.
- [ ] Manifest and checksums are present.
- [ ] Runtime activation uses a separate approved implementation PR.
