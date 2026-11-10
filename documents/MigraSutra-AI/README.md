# MigraSutra AI Documentation

MigraSutra AI is an offline, deterministic, read-only CLI plus 20 portable agent skills. It audits a repository for migration risk, rehearses a manifest change in a temp directory, and produces a conservative release-gate review as JSON, Markdown and HTML.

Tagline: **Upgrade with Evidence. Rehearse Before Change. Recover with Confidence.**

## Read in this order

| Audience | Document | What you get |
| --- | --- | --- |
| Executives, buyers | [Executive summary](01-executive-summary.md) | Problem, value, honest scope, risk |
| Product, QA | [Functional specification](02-functional-spec.md) | Commands, rules, inputs, outputs, verdicts |
| Engineers | [Technical specification](03-technical-spec.md) | Modules, schemas, algorithms, limits |
| Architects | [Architecture](04-architecture.md) | Context, components, data flow, trust boundaries |
| Users | [User guide](05-user-guide.md) | Install, run, read reports, CI, IDE skills |
| Security, legal | [Security, privacy and legal](06-security-privacy-legal.md) | Threat model, license, claims policy |
| Reviewers | [Independent audit and evidence](07-independent-audit.md) | Method, results, limits, how to reproduce |
| Reviewers | [Observed test results](test-results.md) | Machine-written run of the real suite |

## Sample reports

- Risky fixture: [audit-risky.html](evidence/samples/audit-risky.html), `evidence/samples/audit-risky.md`, `evidence/samples/audit-risky.json`
- Clean fixture: [audit-clean.html](evidence/samples/audit-clean.html), `evidence/samples/audit-clean.md`, `evidence/samples/audit-clean.json`

## Three facts to keep in mind

- MigraSutra never executes your tests, installs, scripts or migrations. Test status is always `NOT_RUN`.
- The best verdict it can issue is `REVIEW_REQUIRED`. It never says "safe to deploy".
- Its SQL checks are heuristics. They miss dynamic SQL inside dollar-quoted bodies.

The HTML pages in this folder are generated from the Markdown files by `npm run build:docs`. CI fails if they are stale.
