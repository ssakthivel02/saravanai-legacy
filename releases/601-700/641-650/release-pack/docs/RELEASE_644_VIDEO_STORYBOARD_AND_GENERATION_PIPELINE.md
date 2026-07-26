# Release 644 — Video Storyboard and Generation Pipeline

    ## Objective

    Govern storyboards, scenes, likeness, safety, rights, rendering, captions and approval.

    ## Capability class

    `execution`

    ## Contract fields

    - `executionId` — `string`
- `tenantId` — `string`
- `owner` — `string`
- `idempotencyKey` — `string`
- `maximumSteps` — `number`
- `approvalId` — `string | undefined`
- `dryRun` — `boolean`
- `productionWriteAllowed` — `false`
- `killSwitchAvailable` — `true`
- `status` — `'planned' | 'running' | 'completed' | 'failed' | 'cancelled'`

    ## Mandatory controls

    - `owner_accountability_required`
- `evidence_integrity_required`
- `idempotency_required`
- `kill_switch_required`
- `production_write_forbidden`
- `likeness_review_required`

    ## Architecture intent

    This release is an additive Enterprise Platform v6 contract under
    `releases/601-700/`. It does not automatically activate production routes,
    migrations, external providers or autonomous writes.

    ## Security, privacy and trust requirements

    - Default deny, least privilege and trusted server-derived tenant context.
    - Human accountability for material decisions and side effects.
    - Secrets, prompts, files and personal data excluded from routine logs.
    - Evidence references include integrity hashes, timestamps and review dates.
    - Qualified review for high-stakes, legal, regulatory or sensitive contexts.
    - Free-first cost controls and hard stops.
    - Accessibility, localisation, correction and redress where relevant.
    - Readiness evidence must not be represented as external certification.

    ## Acceptance criteria

    - [ ] Contract and schema validation pass.
    - [ ] Cross-tenant access is denied.
    - [ ] Positive and negative policy tests pass.
    - [ ] Threat, privacy, accessibility, cost and resilience reviews are complete.
    - [ ] Migration and rollback are rehearsed outside production.
    - [ ] Evidence and residual risks have accountable owners.
    - [ ] Feature activation remains disabled by default.

    ## Rollback

    Disable the feature flag, stop affected execution, preserve minimal evidence,
    revert the implementation commit, restore verified data if required and retest
    critical user and operational journeys.

    ## Explicitly out of scope

    - Public registration.
    - Billing, payment collection or Unified Billing.
    - Silent paid-provider activation.
    - Unreviewed production migrations.
    - Autonomous production writes.
    - Unsupported certification claims.
