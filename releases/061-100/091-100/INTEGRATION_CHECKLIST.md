# Releases 091–100 integration checklist

## Baseline

- [ ] PR #8 or equivalent Releases 021–060 baseline is merged and green.
- [ ] Latest `main` is fetched before the new branch is created.
- [ ] Branch: `feature/releases-061-100-enterprise-maturity`.
- [ ] Repository and D1 backup references are recorded.

## Pack review

- [ ] All ten release documents reviewed.
- [ ] Tenant boundaries and approval boundaries reviewed.
- [ ] Migrations tested only in non-production first.
- [ ] OpenAPI contract reviewed.
- [ ] Threat model and abuse cases reviewed.
- [ ] Accessibility, privacy and cultural-safety impact assessed.
- [ ] Existing root `package.json`, `src`, `tests` and migrations remain unchanged.

## Release gate

- [ ] Validator passes.
- [ ] Unit tests pass.
- [ ] Secret and dependency scans pass.
- [ ] Evidence index and checksums generated.
- [ ] Rollback rehearsal completed.
- [ ] Owner go/no-go decision recorded.
