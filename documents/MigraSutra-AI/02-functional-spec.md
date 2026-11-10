# Functional Specification

## Commands

| Command | Purpose | Writes |
| --- | --- | --- |
| `doctor` | Print version, platform, implemented and planned features | stdout |
| `version` | Print the version | stdout |
| `scan --root P --out F [--format json,md,html]` | Static scan | one file |
| `plan --root P --scan F --target T --out F` | Plan for one change | one file |
| `rehearse --root P --plan F --out F` | Temp-dir rehearsal | one file |
| `gate --plan F --rehearsal F --out F [--evidence F]` | Release-gate review | one file |
| `compare --before F --after F --out F` | Diff two scans | one file |
| `render --input F --out F --format md,html` | Re-render any report | one file |
| `audit --root P --out DIR [--target T] [--fail high]` | scan + plan + rehearse + gate in one step | `audit.json`, `audit.md`, `audit.html` |
| `skills --host H --root P` | Copy skills into an IDE path | skill folders |
| `serve --report F --port N` | Localhost read-only API | none |

Targets: `npm:package@1.2.3` or `node:22`. Anything else is refused.

Exit codes: `0` success, `1` `audit --fail high` found a high finding, `2` error.

## Inputs read

Only these root files are read: `package.json`, lockfiles, `requirements.txt`, `pyproject.toml`, `go.mod`, `pom.xml`, `build.gradle(.kts)`, `composer.json`, `Dockerfile`, `.tool-versions`, plus `.sql` files under `migrations`, `db/migrations`, `prisma/migrations` and `database/migrations`. `.env` and other files are never read.

## Rule catalogue

| Rule ID | Severity | Meaning |
| --- | --- | --- |
| `SQL_DROP_TABLE` | high | Destructive table drop |
| `SQL_DROP_COLUMN` | high | Destructive column removal |
| `SQL_TRUNCATE` | high | Destructive truncate |
| `SQL_DELETE_UNSCOPED` | high | `DELETE` with no `WHERE` in the statement |
| `MANIFEST_PARSE` | high | Invalid JSON manifest |
| `SQL_NOT_NULL_NO_DEFAULT` | medium | NOT NULL column added without DEFAULT |
| `SQL_RENAME` | medium | Rename breaks mixed-version readers |
| `NPM_NONREPRODUCIBLE` | medium | `*`, `latest`, `next`, `file:`, git or URL dependency |
| `NPM_NO_LOCKFILE` | medium | Dependencies but no root lockfile |
| `PYTHON_UNPINNED` | medium | Requirement not pinned with `==` |
| `DOCKER_UNPINNED_BASE` | medium | Base image has no tag, uses `latest`, or lacks a digest |
| `SOURCE_NOT_READ` | medium | File was refused (symlink, too large) |
| `SQL_INDEX_NOT_CONCURRENT` | low | `CREATE INDEX` without `CONCURRENTLY` (PostgreSQL concern) |

Comments and single-quoted strings are blanked before matching.

## Verdicts

| Verdict | When |
| --- | --- |
| `NO_GO` | Any high static finding, or the static rehearsal failed |
| `REVIEW_REQUIRED` | Everything else. Tests and rollback are always `NOT_RUN`, so this is the ceiling |
| `GO_CANDIDATE` | Not implemented. Reserved for a future policy with verified test evidence |

Imported evidence passed to `gate --evidence` is labelled `UNVERIFIED_EXTERNAL` and never raises the verdict.

## Acceptance behaviors

- A plan whose `package.json` hash differs from the scan is refused as stale.
- A plan whose action no longer matches its target is refused.
- A dependency value that contains credentials makes planning fail.
- Symlinked files and directories are skipped or refused.
- Files over 1 MiB are rejected, never streamed.
