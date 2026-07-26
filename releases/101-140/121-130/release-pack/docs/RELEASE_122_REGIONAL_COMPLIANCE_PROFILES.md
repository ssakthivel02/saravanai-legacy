# Release 122 — Regional Compliance Profiles

## Objective
Versioned jurisdiction-specific controls with local review, precedence and effective dates.

## Required controls
- `default_deny`
- `evidence_integrity`
- `human_accountability`
- `local_review`
- `regional_profile_required`
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
