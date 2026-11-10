# Independent Audit and Evidence

## Who audited

This is a **self-audit prepared with an AI coding assistant** during the 0.2.0 release. It is not a third-party certification. Treat it as a reproducible checklist: every row names a command you can run yourself.

## Scope

Version 0.2.0: `packages/core`, `packages/cli`, `packages/server`, fixtures, tests, CI and packaging. Skills and agent prompts were checked for structure, not for model behavior.

## Reproduce everything

```bash
git clone https://github.com/shahvatsalofficial/MigraSutra-AI.git && cd MigraSutra-AI
npm test
npm run demo
npm run test:report
npm run check:docs
node packages/cli/index.mjs audit --root fixtures/risky-app --target node:22 --out artifacts/audit
```

## Results

| # | Check | Method | Result |
| --- | --- | --- | --- |
| 1 | Unit and CLI tests | `npm test` | See [test results](test-results.md). Fail count must be 0 |
| 2 | Skipped tests | Same run | 3 symlink tests skip only when the host forbids symlinks; they run on Linux and macOS CI |
| 3 | SQL rule accuracy | 16 labelled cases in `tests/sql-corpus.test.mjs` | 15 correct, 1 known false negative (dollar-quoted dynamic SQL) |
| 4 | Source immutability | Byte comparison before and after `plan`, `rehearse`, `audit` | Unchanged (tests: `plan does not modify source`, `scan never mutates source tree`) |
| 5 | Verdict ceiling | `audit` on a clean fixture | `REVIEW_REQUIRED`, never a pass |
| 6 | Report escaping | Inject `<img src=x onerror=1>` as a filename | Escaped in HTML |
| 7 | Dependencies | `package.json` | Zero runtime dependencies |
| 8 | Network use | Code review of `packages/core` | No network import; rehearsal records `network: false` |
| 9 | Package contents | `npm pack --dry-run` | Only intended files ship |
| 10 | Docs freshness | `npm run check:docs` | HTML equals regenerated output |

## What the 16-case corpus does and does not show

It shows the rules behave as designed on comments, strings, casing, line breaks and safe variants. It is small and written by the maintainer. It is **not** a precision or recall benchmark on real-world code. No such benchmark has been run.

## Findings from the audit (fixed in 0.2.0)

| Finding | Severity | Fix |
| --- | --- | --- |
| Three tests failed on Windows hosts without symlink privilege (`EPERM`) | Medium | Tests skip with a stated reason when symlinks cannot be created |
| Reports were a single preformatted block, hard to scan | Low | Structured Markdown and responsive HTML with severity badges |
| No single command produced all report formats | Low | Added `audit` |
| Few SQL rules for expand-contract risks | Low | Added NOT NULL without DEFAULT, RENAME, non-concurrent index rules |
| Package was marked private and not publishable | Medium | Metadata, `files` list and release workflow added |

## Open limitations (not fixed)

- SQL is heuristic. Dynamic SQL in `$$` bodies is missed.
- No monorepo discovery; only root manifests.
- No version resolution, advisory lookup or release-note evidence.
- No sandboxed execution; tests and rollback are always `NOT_RUN`.
- Skills were not verified inside live IDE hosts.
- Cross-platform CI results are those shown in the repository's Actions tab, not claimed here.
- npm provenance exists only for releases published by the GitHub workflow.

## How to verify claims independently

1. Read `packages/core/index.mjs`. It is a single file under 400 lines.
2. Run the commands above on a machine you control.
3. Compare `test-results.json` with the Actions run for the same commit.
4. Break a rule on purpose and confirm a test fails.
