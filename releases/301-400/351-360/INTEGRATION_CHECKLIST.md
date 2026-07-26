# Integration checklist

- [ ] Releases 221–260 and 261–300 are merged into `main`.
- [ ] Branch `feature/releases-301-400-enterprise-v3` is selected.
- [ ] Pack is under `releases/301-400/351-360/`.
- [ ] Existing SakthiAI validation passes.
- [ ] Pack validator and unit tests pass.
- [ ] Tenant isolation and four-eyes tests pass.
- [ ] D1 migrations are reviewed in non-production only.
- [ ] Threat, privacy, accessibility, cultural-safety and rollback reviews pass.
- [ ] Evidence checksums and manifest are generated.
- [ ] Runtime activation occurs only through a separate approved implementation PR.
