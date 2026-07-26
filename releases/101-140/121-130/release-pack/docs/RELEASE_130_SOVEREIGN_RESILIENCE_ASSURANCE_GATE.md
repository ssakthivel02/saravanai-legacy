# Release 130 — Sovereign Resilience Assurance Gate

## Objective
Residency, continuity, exit, recovery, local review and evidence-integrity gate.

## Required controls
- `default_deny`
- `evidence_integrity`
- `go_no_go_required`
- `human_accountability`
- `local_review`
- `regional_profile_required`
- `residual_risks_recorded`
- `rollback_ready`
- `safe_telemetry`
- `tenant_scope`
- `trusted_identity`

## Acceptance criteria
- [ ] Positive and negative tests pass.
- [ ] Trusted identity and tenant scope are enforced.
- [ ] Material decisions have a human owner.
- [ ] Evidence is attributable and checksummed.
- [ ] Secrets and personal content are excluded from routine telemetry.
- [ ] Migration and rollback are reviewed outside production.
- [ ] No unsupported certification or legal-conformity claim is made.

## Rollback
Disable the capability flag, revert the integration commit, restore the verified snapshot where required, and preserve audit evidence.
