# Release 719 — Research Correction and Retraction Workflow

    ## Objective

    Correct or retract claims, update citations, notify consumers and preserve revision history.

    ## Capability class

    `plan`

    ## Contract fields

    - `planId` — `string`
- `tenantId` — `string`
- `owner` — `string`
- `objective` — `string`
- `dependencyRefs` — `string[]`
- `milestoneIds` — `string[]`
- `evidenceRefs` — `string[]`
- `rollbackOrExitRef` — `string`
- `approvedBy` — `string | undefined`
- `status` — `'draft' | 'approved' | 'active' | 'completed' | 'retired'`

    ## Mandatory controls

    - `owner_accountability_required`
- `evidence_integrity_required`
- `dependencies_required`
- `milestones_required`
- `rollback_or_exit_required`
- `source_authority_review_required`

    ## Architecture intent

    This release is an additive Enterprise Platform v7 contract under
    `releases/701-800/`. Runtime activation, production routes and migrations require
    separate implementation and approval pull requests.

    ## Required assurance

    - Default deny and least privilege.
    - Trusted server-derived identity and tenant context.
    - Human accountability for material decisions and side effects.
    - Evidence integrity, review dates and correction paths.
    - Privacy-safe telemetry with prompts, files, personal data and secrets excluded.
    - Accessibility and localisation for critical user journeys.
    - Free-first cost limits and hard stops.
    - Resilience, rollback and portability.
    - Qualified review for legal, regulatory, safety or high-stakes interpretations.
    - No unsupported certification, employment, financial, medical or legal claim.

    ## Acceptance criteria

    - [ ] Contract and JSON Schema validation pass.
    - [ ] Cross-tenant access is denied.
    - [ ] Positive, negative and abuse tests pass.
    - [ ] Threat, privacy, accessibility, cost and resilience reviews are complete.
    - [ ] Migrations and rollback are rehearsed outside production.
    - [ ] Evidence, residual risks and conditions have accountable owners.
    - [ ] Capability remains disabled by default.

    ## Rollback

    Disable the feature flag, stop affected execution, preserve minimal evidence,
    revert the implementation commit, restore verified data where required and retest
    critical user and operational journeys.

    ## Explicitly out of scope

    - Public registration.
    - Billing, payment collection or Unified Billing.
    - Silent paid-provider activation.
    - Unreviewed production migration.
    - Autonomous production writes.
    - Unsupported certification claims.
