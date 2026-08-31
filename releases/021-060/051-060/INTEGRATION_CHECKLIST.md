# Integration Checklist

## Baseline
- [ ] Latest `main` pulled and tests green
- [ ] Branch `feature/releases-051-060` created
- [ ] Code and D1 backup completed
- [ ] Releases 021–030 controls still active

## Integration
- [ ] Feature flags reviewed
- [ ] Migrations tested in non-production
- [ ] Tenant predicates reviewed
- [ ] OpenAPI contract reviewed
- [ ] Negative-path tests passed
- [ ] Logs checked for secret and personal-data leakage
- [ ] Rollback rehearsed
- [ ] Evidence checksums generated

## Production decision
- [ ] Security review approved
- [ ] Privacy review approved
- [ ] Accessibility review approved
- [ ] Residual risks recorded
- [ ] Owner go/no-go recorded
