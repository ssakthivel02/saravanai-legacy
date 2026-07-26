# Integration checklist

- [ ] Releases 301–400 are merged into `main`.
- [ ] Branch `feature/releases-401-500-enterprise-v4` is selected.
- [ ] Pack is under `releases/401-500/461-470/`.
- [ ] Existing SakthiAI validation passes.
- [ ] Pack validator and unit tests pass.
- [ ] Tenant-isolation and four-eyes tests pass.
- [ ] D1 migrations are reviewed only in non-production.
- [ ] Threat, privacy, accessibility, cost and resilience reviews pass.
- [ ] Evidence checksums and manifest are generated.
- [ ] Runtime activation uses a separate approved implementation PR.
