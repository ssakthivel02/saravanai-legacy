# Runtime Wave 6 Supply-Chain Policy

A release is eligible only for human approval when tests, secret review, dependency review, SBOM, provenance, IaC, licence and workflow evidence are all supplied as passing.

Critical or known-exploited dependencies block the release. High-severity dependencies require a documented mitigation.

Third-party GitHub Actions must be pinned to a full commit SHA. Repository write permissions and secrets in pull-request workflows are rejected.

This policy is an internal engineering baseline and does not assert certification, SLSA level, legal licence clearance or complete vulnerability coverage.
