# SakthiAI Agent Control Plane v0

## Objective

Replace repetitive human tab-switching, prompt copy/paste, status checking and task hand-offs with a governed agent layer that can plan, route, execute, verify and resume work across SakthiAI, GitHub, research providers and approved external tools.

This is not an unrestricted autonomous bot. The design deliberately separates low-risk autonomous execution from actions that require owner approval.

## Design principles

1. **SakthiAI owns orchestration.** Providers are interchangeable workers, not the system of record.
2. **API/MCP first, browser automation last.** Prefer authenticated APIs, MCP servers and native connectors. Use computer/browser control only where no stable API exists.
3. **No prompt copy/paste architecture.** Tasks are represented as structured work packets and passed directly between agents/tools.
4. **One canonical task ledger.** Every task has an ID, project, goal, inputs, state, evidence, cost budget, next action and continuation checkpoint.
5. **Least privilege.** Each agent receives only the tools and data required for the current task.
6. **Human approval before consequential writes.** Production deployment, DNS, payments, identity/security changes, destructive repository operations, external messages and publishing are approval-gated.
7. **Resume, do not restart.** Agents persist checkpoints and continue from the exact unfinished unit.
8. **Evidence before completion.** A task is not complete merely because a model says so; completion requires the defined output/evidence contract.
9. **Cost-aware routing.** Use Sakthi Edge/local/free routes first when they are sufficient; escalate to paid providers only within an explicit budget policy.
10. **Provider independence.** OpenAI, Claude, Gemini, Kimi, Manus, Ollama and future providers are adapters behind a common worker contract.

## Core architecture

```text
User / Schedule / GitHub Event / API Event
                  |
                  v
          Agent Control Plane
                  |
      +-----------+-----------+
      |                       |
      v                       v
 Task Ledger              Policy Engine
      |                       |
      +-----------+-----------+
                  |
                  v
            Orchestrator
                  |
      +-----------+-----------+----------------+
      |           |           |                |
      v           v           v                v
 Research     Build/Code   Data/Content     Project Ops
 Agent        Agent        Agent            Agent
      |           |           |                |
      +-----------+-----------+----------------+
                  |
                  v
              Tool Router
   GitHub / Web / Files / MCP / APIs / Manus
        / OpenAI / Local Ollama / Browser
                  |
                  v
        Evidence + Result Store
                  |
          Approval Queue (if needed)
                  |
                  v
            Final Action / PR
```

## Agent roles

### AG-001 Orchestrator
Breaks a goal into a dependency-aware task graph, assigns workers, enforces policy/budget, retries bounded failures, and persists the continuation checkpoint.

### AG-002 Research Agent
Performs current or deep research, prefers authoritative sources, deduplicates findings, preserves citations/provenance, and returns structured evidence rather than prose-only summaries.

### AG-003 Build / Coding Agent
Works on isolated branches, writes code/config/tests, evaluates CI evidence, and opens draft PRs. It does not merge to protected branches without the applicable approval policy.

### AG-004 Data / Content Factory Agent
Creates and extends structured datasets/content packs for approved projects. It resumes exact corpus checkpoints, checks IDs/schema/obvious duplication, and avoids repeated historical reconciliation unless explicitly requested.

### AG-005 Project Operations Agent
Maintains the canonical task ledger, dependencies, blockers, next actions and project-level progress. It should choose useful build/data work rather than repeatedly generating status reports.

### AG-006 Evidence / Verification Agent
Validates the minimum evidence required by the task contract: schema validity, tests, source provenance, CI status, output existence, or other defined acceptance evidence. It is not a generic endless audit agent.

### AG-007 Artifact Agent
Creates reusable documents, spreadsheets, presentations, code packages, import packs and media metadata from structured task outputs.

### AG-008 Publishing Agent
Prepares publishing packages such as YouTube title/description/chapters/tags/thumbnails briefs, app-store metadata and release notes. Final public publishing remains approval-gated until the owner explicitly enables a bounded publishing policy.

### AG-009 Communication Agent
Drafts email/messages/updates from task state. External send is approval-gated unless a future narrowly-scoped rule is explicitly approved.

### AG-010 Computer-Use Agent
Fallback worker for websites without usable APIs/connectors. It operates in a sandboxed browser profile, never receives reusable secrets in prompts, and stops for authentication or consequential actions where required.

## Autonomy classes

### GREEN — autonomous
Examples:
- research and source collection;
- read-only GitHub inspection;
- creating structured datasets in staging;
- generating prompts, scripts, metadata and artifacts;
- creating a new branch;
- writing to an isolated agent branch;
- running tests/linters in an isolated environment;
- opening a **draft** pull request;
- checking CI and collecting logs;
- updating the internal task ledger;
- preparing a deployment/publishing action packet without executing it.

### AMBER — execute only with explicit approval or pre-authorised bounded policy
Examples:
- merging a PR;
- sending email or external messages;
- publishing a YouTube video;
- submitting app-store changes;
- production deployment;
- changing Cloudflare/DNS;
- changing repository settings or branch protection;
- creating/changing paid-provider billing configuration;
- modifying authentication/RBAC policy;
- deleting or overwriting persistent data.

### RED — never autonomous
Examples:
- sharing passwords, API keys or private keys in prompts;
- disabling safeguards to complete a task;
- transferring money or making purchases without an explicit transaction-specific instruction;
- bypassing MFA/identity controls;
- destructive bulk deletion without an independently verified recovery path and explicit owner approval;
- impersonating the owner or another person.

## Work packet contract

Every agent job should use a structured packet similar to:

```json
{
  "task_id": "TASK-2026-000001",
  "project": "sakthiai",
  "goal": "Implement capability X",
  "priority": "P1",
  "autonomy": "GREEN",
  "inputs": [],
  "dependencies": [],
  "allowed_tools": [],
  "forbidden_actions": [],
  "budget": {"policy": "balanced", "hard_limit": null},
  "acceptance": [],
  "state": "queued",
  "checkpoint": null,
  "evidence": [],
  "next_action": null
}
```

## User workflows to automate first

### Wave A — immediate, high ROI
1. **GitHub control tower** — inspect project issues/PRs/CI, choose the next safe build task, work on a branch, produce a draft PR, preserve the next checkpoint.
2. **Research-to-build pipeline** — research a topic once, structure the evidence, convert it into implementation/data tasks, and hand those directly to build/content agents.
3. **Content factories** — continue OmSaravanaBhava, DivyaNexus, KirthiVerse, RamaVerse and SakthiAI datasets from durable checkpoints without manual prompt re-entry.
4. **Prompt/task dispatch** — replace copying a ChatGPT prompt into another provider with a provider adapter that receives the same work packet programmatically.
5. **CI failure triage** — detect failed workflows, read the failing job/logs, create a bounded remediation task, patch on a branch and rerun only the necessary checks.
6. **Artifact packaging** — turn completed structured work into ZIP/import packs/reports/release metadata automatically.
7. **YouTube preparation** — for completed videos, automatically prepare upload-ready metadata, chapters, thumbnail brief, language variants and a rights/safety checklist; publishing itself remains approval-gated.

### Wave B — after identity/RBAC + approval queue is production-ready
1. production deployment action packets and owner-approved execution;
2. Cloudflare/DNS changes under narrowly-scoped policies;
3. external email/message sending;
4. app-store and YouTube publishing;
5. cross-project portfolio orchestration;
6. bounded account-administration actions.

## Provider strategy

### Now
Use ChatGPT as the primary orchestration surface because it already has connected GitHub, web/files capability, scheduled tasks and direct task execution. Use Manus as a specialised worker for deep research, websites, mobile apps, slides and videos when that is the best worker for a defined packet.

### SakthiAI target state
SakthiAI becomes the permanent control plane. Recommended implementation direction:
- provider-neutral worker interface;
- OpenAI Responses API / Agents SDK adapter;
- MCP connector layer;
- GitHub adapter;
- Manus adapter where an API/connector is available;
- Gemini/Claude/Kimi adapters where permitted;
- optional Ollama/local worker;
- D1 or equivalent task/event ledger;
- durable execution/checkpoint store;
- approval queue;
- cost and quota ledger;
- evidence/event log;
- secrets stored only in server-side secret stores.

No production feature should depend on a human keeping multiple AI browser tabs open.

## Event model

Agents should start from four trigger classes:

1. **User request** — direct task from SakthiAI/ChatGPT.
2. **Schedule** — hourly/daily/weekly recurring work.
3. **Repository event** — PR/CI/issue activity.
4. **External event** — new approved email/message/file/webhook event.

Each trigger creates or resumes a work packet; it must not create duplicate parallel work for the same canonical task.

## Failure and retry model

- classify failures as transient, authentication, quota, validation, policy or permanent;
- use bounded retries with backoff for transient failures;
- do not retry policy/auth failures blindly;
- store partial outputs before retry;
- preserve exact continuation checkpoints;
- route to another provider only if policy and budget allow it;
- never represent a queued/running/failed worker task as completed.

## Phase plan

### Phase 0 — initiated now
- controlled branch for agent-control-plane design;
- machine-readable capability registry and policy;
- ChatGPT scheduled orchestrator for safe SakthiAI/GitHub work;
- no production write authority.

### Phase 1 — task ledger + orchestrator MVP
- task schema/API;
- event and checkpoint persistence;
- deterministic tool permission checks;
- GitHub read/write-on-branch worker;
- scheduled trigger integration;
- evidence contract.

### Phase 2 — multi-worker routing
- research worker;
- build worker;
- content worker;
- artifact worker;
- provider adapters;
- bounded retry/fallback.

### Phase 3 — approval system
- owner approval inbox;
- signed action packets;
- approval expiry;
- one-click approve/reject;
- immutable execution/result references.

### Phase 4 — computer-use fallback
- isolated browser profiles;
- domain allow-lists;
- visible authentication hand-off;
- screenshot/action evidence;
- strict stop conditions.

### Phase 5 — SakthiAI becomes the primary autonomous control plane
- cross-project orchestration;
- persistent agent memory scoped by project/tenant;
- budgets/quotas;
- dashboards;
- mobile control surface;
- optional local workers.

## Success metrics

Track:
- manual copy/paste hand-offs eliminated;
- tasks completed without user tab switching;
- successful autonomous GREEN tasks;
- approval requests by type;
- retry/failure rate;
- duplicate-task rate;
- cost per completed task;
- percentage of work resumed from checkpoints rather than restarted;
- PRs produced with passing evidence;
- time spent by the owner on coordination versus decisions.

## Non-goals for v0

- unrestricted production autonomy;
- autonomous financial transactions;
- hiding provider usage/cost;
- browser automation when a stable API/connector exists;
- claiming general intelligence or error-free execution;
- rebuilding existing SakthiAI architecture from zero.
