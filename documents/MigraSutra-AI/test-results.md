# Test results (observed)

Command: `node --test tests/*.test.mjs`

| Total | Pass | Fail | Skipped | Exit code |
| --- | --- | --- | --- | --- |
| 99 | 96 | 0 | 3 | 0 |

Environment: Node v24.15.0, win32/x64, commit `uncommitted`.

Skips: Symlink tests skip when the host forbids symlink creation (Windows without Developer Mode); they run on Linux and macOS CI.

Regenerate with `npm run test:report`. This file is machine-written from the real run; it is not edited by hand.

## Cases

- PASS — help includes safe commands
- PASS — parseArgs parses flags
- PASS — parseArgs rejects missing flag value
- PASS — doctor command works offline
- PASS — scan CLI writes JSON
- PASS — scan CLI writes markdown
- PASS — CLI plan and rehearse
- PASS — CLI refuses unsupported command
- PASS — CLI refuses missing output
- PASS — installer copies skills without overwriting
- PASS — installer supports five host layouts
- PASS — installer rejects unknown IDE
- SKIP — installer refuses symlinked directory
- PASS — server token check uses bounded compare
- PASS — server rejects weak token
- PASS — server enforces bearer auth and read-only routes
- PASS — server is localhost auth-only
- PASS — version command prints semver
- PASS — audit CLI writes json, md and html
- PASS — audit --fail high exits 1 on high findings
- PASS — audit requires --out
- PASS — scan identifies correct schema
- PASS — clean fixture produces no warnings
- PASS — risky fixture produces high findings
- PASS — risky fixture finds DROP TABLE
- PASS — risky fixture finds DROP COLUMN
- PASS — risky fixture finds TRUNCATE
- PASS — risky fixture finds unscoped DELETE
- PASS — risky fixture finds unpinned Python requirement
- PASS — risky fixture finds unpinned Docker base
- PASS — risky fixture finds npm nonreproducible dep
- PASS — risky fixture finds missing lockfile
- PASS — malformed manifest flagged without exception
- PASS — scan contains no fake executed tests
- PASS — scan evidence contains digest
- PASS — evidence ID deterministic
- PASS — hash changes when content changes
- PASS — target parser supports npm
- PASS — target parser supports Node engine
- PASS — target parser refuses unsupported ecosystem
- PASS — target parser refuses command injection
- PASS — npm name validation rejects whitespace
- PASS — version validator rejects scripts
- PASS — plan requires a declared package
- PASS — plan includes baseline digest
- PASS — plan action keeps old and new versions
- PASS — plan supports Node engine modification
- PASS — plan does not modify source
- PASS — stale scan refused
- PASS — static rehearsal creates transform without modifying source
- PASS — rehearsal hashes differ for intended patch
- PASS — rehearsal records no execution
- PASS — rehearsal of Node engine change works
- PASS — rehearsal with stale baseline fails
- PASS — rehearsal malicious action refused
- PASS — gate refuses unilateral GO
- PASS — gate imported evidence stays unverified
- PASS — gate high static risk blocks release
- PASS — gate detects incompatible plan IDs
- PASS — comparison detects stable findings
- PASS — comparison detects resolution
- PASS — markdown contains explicit static-only disclaimer
- PASS — HTML escapes untrusted report strings
- PASS — safeRead rejects parent directory
- SKIP — safeRead rejects symlink
- PASS — within recognizes boundaries
- PASS — SQL comments not treated as active drop
- PASS — only selected repository files inspected
- SKIP — scanner refuses symlinked SQL migration ancestors
- PASS — plan refuses credential-bearing dependency version
- PASS — rehearsal refuses tampered action version
- PASS — rehearsal output does not disclose full package manifest
- PASS — compareVersions orders numerically not lexically
- PASS — compareVersions rejects injection
- PASS — audit of risky app is NO_GO with zero tests executed
- PASS — audit of clean app never returns a GO verdict
- PASS — audit without target records scan-only note
- PASS — audit with bad target reports note instead of throwing
- PASS — audit markdown and html render verdict and escape
- PASS — NOT NULL without default is flagged, with default is not
- PASS — RENAME and non-concurrent index flagged
- PASS — go.mod and composer.json inventoried
- PASS — scan never mutates source tree (audit run)
- PASS — sql corpus: drop in line comment
- PASS — sql corpus: drop in block comment
- PASS — sql corpus: drop inside string literal
- PASS — sql corpus: drop table if exists
- PASS — sql corpus: delete with where
- PASS — sql corpus: delete without where
- PASS — sql corpus: not null with default
- PASS — sql corpus: nullable add column
- PASS — sql corpus: not null without default
- PASS — sql corpus: truncate
- PASS — sql corpus: lowercase drop column
- PASS — sql corpus: multiline drop column
- PASS — sql corpus: rename column
- PASS — sql corpus: index without concurrently
- PASS — sql corpus: index concurrently
- PASS — sql corpus: dollar-quoted dynamic drop (known limitation)
