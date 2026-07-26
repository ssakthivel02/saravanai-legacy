# Releases 821–830 roadmap

    | Release | Capability | Intended outcome |
    |---:|---|---|
    | 821 | Agent Execution Request and Purpose Contract | Bind agent execution to tenant, actor, purpose, plan, tools, limits, expiry and accountable owner. |
| 822 | Agent Plan Compiler and Static Validator | Compile plans into bounded steps and reject prohibited tools, excessive authority and missing approvals. |
| 823 | Tool Lease and Scoped Capability Runtime | Issue short-lived tool leases limited by tenant, action, resource, purpose and maximum side effects. |
| 824 | Human Approval Inbox and Decision Runtime | Present material agent actions for independent approval with context, evidence, expiry and alternatives. |
| 825 | Checkpoint and Durable Agent State | Persist minimal checkpoints, plan state, tool outcomes and compensation references for recovery. |
| 826 | Agent Sandbox Network and File Boundary | Enforce isolated code, filesystem, network, memory, CPU and temporary artefact controls. |
| 827 | Compensating Action and Rollback Executor | Execute approved compensation for partially completed workflows with idempotency and evidence. |
| 828 | Agent Kill Switch and Emergency Stop | Stop tenant, workflow, tool or global agent execution and revoke active leases safely. |
| 829 | Agent Behaviour Evaluation and Drift Response | Evaluate denials, action patterns, tool use, outcome drift, policy bypass and corrective actions. |
| 830 | Bounded Agent Runtime Activation Gate | Gate agent operation on purpose, plans, leases, approval, state, sandbox, recovery and kill-switch evidence. |
