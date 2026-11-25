# Architecture

## Context

The CLI calls a read-only core. The core reads allow-listed files, writes only to a temp folder during rehearsal, and returns JSON, Markdown or HTML. There is no cloud service.

<!-- html:layers -->

<!-- html:trust -->

There is no cloud service, no telemetry and no model call in the product.

## Components

| Component | Responsibility | Depends on |
| --- | --- | --- |
| Core | Scan, plan, rehearse, gate, compare, audit, render | Node standard library only |
| CLI | Parse options, write files, install skills | Core, Server |
| Server | Serve a stored report on loopback | Node `http` |
| Skills | Procedural instructions for AI hosts | None at runtime |
| Agents | Role prompts for hosts with subagents | None at runtime |
| Schemas, rules, policies | Machine-readable contracts | None |

Core never imports the CLI or the server. Dependencies point inward.

## Lifecycle

<!-- diagram:pipeline -->

<!-- html:lifecycle -->

Each hop carries hashes. The plan binds to the scan's `package.json` hash. The gate binds to the plan ID. A mismatch stops the flow.

## Trust boundaries

| Boundary | Untrusted input | Control |
| --- | --- | --- |
| Repository files | Manifests, SQL, Dockerfile text | Size cap, symlink refusal, treated as data |
| Plan file from disk | Edited action or target | Action re-validated against target |
| Imported evidence | Claims that tests passed | Labelled `UNVERIFIED_EXTERNAL` |
| CLI arguments | Injection strings | Strict validators; no shell is ever spawned |
| Report viewer | Strings that reach HTML | Escaped on output |
| Server clients | Anyone on the machine | Loopback bind, bearer token, GET only |

## Key decisions

1. **Offline and deterministic.** Same input gives the same findings and IDs. This makes audits reproducible.
2. **No execution.** Running unknown project code is the largest risk in migration tooling, so v0.2 does not.
3. **Verdict ceiling.** The tool cannot know test results, so its best verdict is `REVIEW_REQUIRED`.
4. **Heuristic SQL checks, stated as such.** A false claim of parsing would be worse than a clear limit.
5. **Skills separate from code.** Skills guide hosts; the CLI works without any AI.

## Roadmap (planned, not shipped)

Runnable sandbox rehearsal, OpenRewrite and jscodeshift adapters, a database restore lab, OpenTofu plan review, and a team server. Each needs a threat model and tests before it is called implemented.
