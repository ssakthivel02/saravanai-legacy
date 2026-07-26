# Runtime Wave 1 Acceptance Checklist

- [ ] Existing `npm test` passes.
- [ ] Runtime Wave 1 validator passes.
- [ ] All Runtime Wave 1 tests pass.
- [ ] PR changes only the intended entry routing and new additive files.
- [ ] Cloudflare Access is active for private routes.
- [ ] `OWNER_EMAIL` is configured outside source control.
- [ ] `RUNTIME_WAVE1_ENABLED` remains false at merge time.
- [ ] No D1 migration has been executed.
- [ ] No paid provider, billing or payment feature is enabled.
- [ ] Status endpoint exposes no sensitive identity or content.
- [ ] Owner context masks the email address.
- [ ] Cross-tenant and mutating policy tests are green.
- [ ] Secret-leakage tests are green.
- [ ] Rollback has been reviewed.
