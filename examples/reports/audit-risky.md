# MigraSutra Audit Report

Generated: 2026-11-10T20:11:25.875Z · tool 0.2.0 · mode: offline, static, read-only

## Verdict: `NO_GO`

| Severity | Count |
| --- | --- |
| High | 4 |
| Medium | 4 |
| Low | 0 |

Files read: 4 · Target-app tests executed: **0** (MigraSutra never runs them; the verdict is never a deploy approval).

**Mode:** static only · no migration scripts executed

## Inventory
- containers: `Dockerfile`
- sql: `migrations/001_unsafe.sql`
- npm: `package.json`
- python: `requirements.txt`

## Findings (8)

| Severity | Rule | Location | Description | Evidence |
| --- | --- | --- | --- | --- |
| HIGH | SQL_DROP_TABLE | `migrations/001_unsafe.sql:2` | Potentially destructive DROP TABLE statement | MS-53da2c153a38 |
| HIGH | SQL_DROP_COLUMN | `migrations/001_unsafe.sql:3` | Potentially destructive column removal | MS-d783e3230f1b |
| HIGH | SQL_TRUNCATE | `migrations/001_unsafe.sql:4` | Potentially destructive TRUNCATE statement | MS-b8fe4c423f13 |
| HIGH | SQL_DELETE_UNSCOPED | `migrations/001_unsafe.sql:5` | DELETE statement without WHERE detected by heuristic; manual SQL review required | MS-6b2281bbf108 |
| MEDIUM | DOCKER_UNPINNED_BASE | `Dockerfile:1` | Docker base image is not digest pinned; review repeatability | MS-a63ace9671fc |
| MEDIUM | NPM_NO_LOCKFILE | `package.json:1` | Dependency manifest has packages but no recognized root lockfile; reproducibility needs review | MS-64aeb08bf170 |
| MEDIUM | NPM_NONREPRODUCIBLE | `package.json:1` | Dependency source/version may be unstable or nonregistry; verify reproducibility | MS-a1821bcfc924 |
| MEDIUM | PYTHON_UNPINNED | `requirements.txt:1` | Python dependency is not pinned to an exact version by the basic static rule | MS-5477fb6a81ef |

## Not performed
- No dependency versions were resolved online
- No test commands, scripts, codemods, or database migrations were executed
- Static SQL patterns are heuristics, not dialect-complete parsing
- Static analysis cannot prove runtime compatibility or rollback safety


---

### Plan

**Target:** node-engine engine → 22

**Decision:** REVIEW_REQUIRED

## Action
- package.json: engines.node from (unset) to 22

## Prerequisites
- Check vendor-supported upgrade path and version release notes
- Confirm supported runtime and dependency graph
- Preserve verified source-control commit and backups
- Run applicable tests in a reviewed isolated environment
- Approve rollback and forward-fix playbook

## Rollback
Restore original manifest from version control or verified backup, then restore the lockfile and reinstall in an isolated environment; database rollback needs its own tested recovery procedure


---

### Rehearsal

**Static rehearsal:** STATIC_CHANGE_VERIFIED

- Source unchanged: true
- Tests: NOT_RUN
- Rollback: DOCUMENTED_NOT_TESTED

## Change
- engines.node: (unset) → 22


---

### Gate

**Decision:** NO_GO

- High-severity static findings remain; separate remediation and review needed
- Required build, unit, integration and migration-specific tests have not been executed by MigraSutra
- Rollback strategy has not been independently rehearsed


