# ADR-003: Non-Executing SRE Controls

## Decision

Runtime Wave 5 produces evaluations, classifications and plans only. It cannot send alerts, open incidents, execute commands, deploy, change traffic or roll back production.

## Rationale

This preserves owner control, prevents accidental production actions, avoids paid integrations and allows the SRE policy model to be tested safely before operational activation.
