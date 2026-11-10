# Security, Privacy and Legal

This is engineering documentation, not legal advice. Have counsel review before commercial redistribution.

## Threat model

| Threat | Mitigation | Test |
| --- | --- | --- |
| Path traversal | `within()` check and root resolution | `safeRead rejects parent directory` |
| Symlink escape | Every path segment is `lstat`-checked | `safeRead rejects symlink` (skips where symlinks are not permitted) |
| Oversized input | 1 MiB read cap | `safeRead` size check |
| Command injection in targets | Strict regex validators; no shell | `target parser refuses command injection` |
| Credential leakage in plans | Credential-bearing dependency values refused | `plan refuses credential-bearing dependency version` |
| HTML injection in reports | Escaped output | `HTML escapes untrusted report strings`, `audit markdown and html render verdict and escape` |
| Tampered plan | Action re-validated against target | `rehearsal refuses tampered action version` |
| Stale approvals | Baseline hash comparison | `rehearsal with stale baseline fails` |
| Unauthenticated server use | Loopback bind, bearer token, GET only | `server is localhost auth-only` |
| Prompt injection in repo text | Repo text is data; nothing is executed | By design: the core has no execution path |

## Privacy

- No network access, telemetry, analytics or accounts.
- `.env` and unlisted files are never read.
- Reports contain relative paths, rule IDs, hashes and short descriptions, not file contents.
- Secret-looking `KEY=value` text in error summaries is redacted.

## What this product does not guarantee

It does not guarantee absence of vulnerabilities, safe migrations or compatibility. A `REVIEW_REQUIRED` verdict is not approval. Do not use it as the sole control before changing production data.

## License and attribution

- License: Apache-2.0, see `LICENSE`. Copyright 2026 Vatsal Shah.
- Zero runtime dependencies, so there are no third-party libraries to relicense. See `THIRD_PARTY_NOTICES.md`.
- Tool names such as OpenRewrite, Flyway, Renovate and Testcontainers appear only as documentation references. They are trademarks of their owners. No affiliation or endorsement is claimed.
- The Sutra product family names (ArchSutra, VigilSutra and others) belong to the same author and are independent packages.

## Name and trademark status

The npm name `migrasutra` returned 404 (unregistered) when last checked on 2026-11-11. This is an availability observation, not a trademark clearance. No trademark search has been done. The maintainer should run one before commercial branding.

## Claims policy

The project does not publish unverified download counts, endorsements, compliance badges or performance numbers. Every metric in this folder links to a reproducible command.

## Reporting a vulnerability

Use GitHub private vulnerability reporting on the repository, as described in `SECURITY.md`. Do not open a public issue for a vulnerability.
