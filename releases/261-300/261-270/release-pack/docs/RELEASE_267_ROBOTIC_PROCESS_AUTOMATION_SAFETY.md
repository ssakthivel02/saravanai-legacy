# Release 267 — Robotic Process Automation Safety

        ## Objective

        Control desktop and browser automation through allowlists, dry-run, idempotency, bounded steps and kill switches.

        ## Control objectives

        - `application_allowlist_required`
- `idempotency_required`
- `production_write_forbidden`
- `kill_switch_required`

        ## Mandatory boundaries

        - Identity and tenant context are trusted server-side inputs.
        - Default deny and least privilege apply.
        - Material actions require attributable human accountability.
        - Sensitive content is excluded from routine telemetry.
        - Paid services and production writes are not enabled by this pack.
        - Legal, regulatory, accreditation or certification status is not implied.
        - Child, cultural, religious and public information requires appropriate review.

        ## Acceptance criteria

        - [ ] Positive and negative tests pass.
        - [ ] Cross-tenant access is denied.
        - [ ] API and JSON schemas are versioned.
        - [ ] Evidence uses integrity hashes.
        - [ ] Threat, privacy and rollback reviews are recorded.
        - [ ] Recovery or correction has been rehearsed outside production.
        - [ ] Residual risks have owners and review dates.

        ## Rollback

        Disable the feature flag, revert the implementation commit, restore verified data if
        required, validate core journeys and preserve audit evidence.
