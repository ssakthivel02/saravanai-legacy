# Runtime Wave 6 Low-Level Design

- `sbom.js`: CycloneDX/SPDX-shaped component validation.
- `dependency.js`: supplied vulnerability and mitigation assessment.
- `provenance.js`: repository, commit, builder and artifact digest validation.
- `secrets.js`: bounded pattern detection with redacted preview.
- `iac.js`: structured resource policy checks.
- `licenses.js`: allowlist and review classifications without legal conclusions.
- `workflow.js`: event, permission and action-pinning checks.
- `artifact.js`: name, digest, size and extension validation.
- `attestation.js`: unsigned deterministic statement generation.
- `repository.js`: branch-protection baseline review.
- `exception.js`: temporary exception boundaries.
- `release-gate.js`: mandatory evidence aggregation.
- `evidence.js`: canonical payload hashing without signing or publication.
