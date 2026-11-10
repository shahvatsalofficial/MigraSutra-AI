# Executive Summary

## The problem

Upgrades fail when teams cannot say what is changing, what could break, what was tested and how to recover. Plans and chat answers read well but carry no proof. A dependency bump, a column drop or an unpinned base image can pass review because nobody collected the evidence.

## What MigraSutra AI does

- Scans a repository read-only and lists migration risks with file, line, rule ID and a content hash.
- Builds a reviewable plan for one supported change: an npm dependency version or the Node engine.
- Rehearses that change on a copy in a temp directory and proves the source tree is untouched.
- Issues a release-gate review that always requires a human and never reports the untested as passed.
- Writes every result as JSON, Markdown and HTML so engineers, auditors and managers read the same facts.

## Why it is trustworthy

| Property | How it is enforced |
| --- | --- |
| Offline | No network calls in the core. A test asserts the rehearsal records `network: false`. |
| Read-only | Rehearsal writes only to a temp directory. A test compares bytes before and after. |
| No code execution | The core never spawns a process. Only the test harness does. |
| Honest status | `NOT_RUN`, `UNVERIFIED_EXTERNAL` and `DOCUMENTED_NOT_TESTED` are first-class values. |
| Tamper checks | A stale scan, changed baseline or edited plan action is refused. |

## What it does not do

- It does not run your test suite, build or migration. It cannot prove behavior.
- It does not resolve versions online or read vendor release notes.
- It does not perform codemods, database rehearsal or container sandboxing. These are on the roadmap, not shipped.
- It is not a certification, a compliance attestation or a deploy approval.

## Business value

- Faster review: one HTML page replaces a scattered checklist.
- Auditable: hashes and rule IDs let a second person reproduce every finding.
- Cheap to adopt: Node 22 or newer, zero runtime dependencies, no account, no key.
- Reusable inside AI IDEs: 20 skills install into Claude Code, Cursor, Codex, Gemini CLI and Copilot paths.

## Maturity

Version 0.2.0 is an early release. Static scanning, planning, static rehearsal, gating, comparison and reporting are implemented and tested. See the [audit](07-independent-audit.md) for the measured results and the open limits.
