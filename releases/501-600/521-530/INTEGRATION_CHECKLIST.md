# Integration checklist

- [ ] Releases 401–500 are merged into `main`.
- [ ] Branch `feature/releases-501-600-enterprise-v5` is selected.
- [ ] Pack is under `releases/501-600/521-530/`.
- [ ] Existing SakthiAI validation passes.
- [ ] Pack validator and unit tests pass.
- [ ] Tenant-isolation and four-eyes tests pass.
- [ ] D1 migrations are reviewed only in non-production.
- [ ] Threat, privacy, accessibility, cost and resilience reviews pass.
- [ ] Evidence checksums and manifest are generated.
- [ ] Runtime activation uses a separate approved implementation PR.
