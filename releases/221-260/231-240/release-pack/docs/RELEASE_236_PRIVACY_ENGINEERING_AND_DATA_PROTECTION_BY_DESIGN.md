# Release 236 — Privacy Engineering and Data Protection by Design
## Objective
Embed minimisation, retention, rights and sharing controls.
## Controls
- `release_236_owner_required`
- `release_236_evidence_required`
- `release_236_tenant_scope_required`
- `release_236_rollback_required`
## Boundaries
Trusted identity and tenant context, default deny, least privilege, evidence-backed decisions, privacy-safe telemetry, disabled paid activation and separate production approval.
## Acceptance
- [ ] Positive and negative tests pass.
- [ ] Cross-tenant access is denied.
- [ ] Schema and API contracts are versioned.
- [ ] Threat, privacy, cost and rollback reviews are recorded.
- [ ] Residual risks have owners and review dates.
## Rollback
Disable the feature flag, revert the implementation commit, restore verified data if required and preserve audit evidence.
