# Release 159 — Billing Readiness without Activation

        ## Objective

        Prepare invoice, tax, credit and dispute contracts while keeping charging and Unified Billing disabled.

        ## Control objectives

        - `tax_review_required`
- `invoice_disabled`
- `payment_collection_disabled`

        ## Mandatory engineering boundaries

        - Identity and tenant context must come from trusted server-side controls.
        - Material decisions retain attributable human ownership.
        - Sensitive data is excluded from routine logs and analytics.
        - Write operations require least privilege, idempotency and approval.
        - Paid services and production activation remain disabled by this pack.
        - Accessibility, privacy, security and rollback are release criteria.

        ## Acceptance criteria

        - [ ] Positive and negative tests pass.
        - [ ] Cross-tenant access is denied.
        - [ ] API and data contracts are versioned.
        - [ ] Evidence references include integrity hashes.
        - [ ] Threat and privacy reviews are complete.
        - [ ] Rollback and recovery have been rehearsed outside production.

        ## Rollback

        Disable the release feature flag, revert the integration commit, restore the last
        verified data snapshot where applicable and preserve decision/audit evidence.
