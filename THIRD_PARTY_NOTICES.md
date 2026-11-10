# Third-party notices

MigraSutra AI 0.2.0 has **zero runtime dependencies** (`dependencies` is empty). It uses only the Node.js standard library (`node:fs`, `node:path`, `node:os`, `node:crypto`, `node:http`, `node:test`).

GitHub Actions used in CI (not shipped in the npm package): `actions/checkout`, `actions/setup-node`, `actions/upload-artifact`, each under its own license.

Verify with `npm ls --all` and `npm pack --dry-run`.
