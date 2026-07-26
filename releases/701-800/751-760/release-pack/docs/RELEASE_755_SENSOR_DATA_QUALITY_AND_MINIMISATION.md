# Release 755 — Sensor Data Quality and Minimisation

    ## Objective

    Validate sensor accuracy, context, quality, purpose, retention, privacy and anomaly handling.

    ## Capability class

    `assessment`

    ## Contract fields

    - `assessmentId` — `string`
- `tenantId` — `string`
- `subjectId` — `string`
- `owner` — `string`
- `methodologyRef` — `string`
- `score` — `number`
- `findingIds` — `string[]`
- `evidenceRefs` — `string[]`
- `decision` — `'pending' | 'pass' | 'conditional' | 'fail'`

    ## Mandatory controls

    - `owner_accountability_required`
- `evidence_integrity_required`
- `methodology_required`
- `findings_review_required`
- `data_classification_required`

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
