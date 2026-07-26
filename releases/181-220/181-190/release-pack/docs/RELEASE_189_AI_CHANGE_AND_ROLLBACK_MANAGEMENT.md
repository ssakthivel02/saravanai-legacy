# Release 189 — AI Change and Rollback Management

        ## Objective

        Govern model, prompt, policy, corpus and agent changes through impact review, canaries, evidence, rollback and change windows.

        ## Control objectives

        - `impact_assessment_required`
- `canary_required`
- `rollback_required`
- `approval_required`

        ## Mandatory boundaries

        - Identity and tenant context are server-derived.
        - Default deny and least privilege apply.
        - Material actions require attributable human accountability.
        - Sensitive content is excluded from routine logs and analytics.
        - Evidence references use integrity hashes.
        - Paid services and production writes are not activated by this pack.
        - Legal, regulatory or certification status is not inferred from control mappings.

        ## Acceptance criteria

        - [ ] Positive and negative tests pass.
        - [ ] Cross-tenant access is denied.
        - [ ] API, data and schema contracts are versioned.
        - [ ] Threat and privacy reviews are recorded.
        - [ ] Recovery and rollback are rehearsed outside production.
        - [ ] Residual risks have owners and review dates.

        ## Rollback

        Disable the release flag, revert the implementation commit, restore the last verified
        data snapshot where required, validate core journeys and preserve audit evidence.
