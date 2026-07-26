# Integration checklist

- [ ] Releases 501–600 are merged into `main`.
- [ ] Branch `feature/releases-601-700-enterprise-v6` is selected.
- [ ] Pack is under `releases/601-700/641-650/`.
- [ ] Existing SakthiAI validation passes.
- [ ] Pack validator and unit tests pass.
- [ ] Tenant-isolation and four-eyes tests pass.
- [ ] D1 migrations are reviewed only in non-production.
- [ ] Threat, privacy, accessibility, cost and resilience reviews pass.
- [ ] Evidence manifest and checksums are present.
- [ ] Runtime activation uses a separate approved implementation PR.
