# ADR-004: Metadata-Only Supply-Chain Assessment

## Decision

Runtime Wave 6 evaluates only metadata and bounded content explicitly supplied by the authenticated owner. It does not fetch repositories, resolve packages, query vulnerability databases, download artifacts, sign statements or change repository configuration.

## Rationale

This makes the control model testable without introducing credentials, external dependencies, hidden costs or unintended modifications to production systems.
