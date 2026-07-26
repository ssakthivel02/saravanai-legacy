# Programme architecture

The programme is organised as ten independent domain packs. Shared identity, tenant,
policy, approval, evidence, observability, privacy, cost and rollback controls are
mandatory. Each capability is integrated separately into the production Worker through
a dedicated implementation pull request and disabled-by-default feature flag.
