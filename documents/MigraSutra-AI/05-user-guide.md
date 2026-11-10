# User Guide

## Install

Requires Node.js 22 or newer.

```bash
npx migrasutra@latest doctor
```

Or from source:

```bash
git clone https://github.com/shahvatsalofficial/MigraSutra-AI.git
cd MigraSutra-AI
npm test
npm run demo
```

If `npx migrasutra` returns 404, the npm release has not been published yet. Use the source install.

## Five-minute tour

Audit the bundled risky fixture and open the report:

```bash
node packages/cli/index.mjs audit --root fixtures/risky-app --target node:22 --out artifacts/audit
```

Open `artifacts/audit/audit.html` in a browser. Expected verdict: `NO_GO` with 4 high and 4 medium findings.

Audit your own project:

```bash
npx migrasutra audit --root . --out migrasutra-report --target npm:express@5.0.0
```

The `--target` package must already be declared in your `package.json`. MigraSutra never adds dependencies.

## Reading a report

1. **Verdict.** `NO_GO` means fix the high findings first. `REVIEW_REQUIRED` means a person must review; it does not mean safe.
2. **Findings table.** Sorted high to low. The evidence ID is stable, so you can track a finding across runs.
3. **Plan and rehearsal.** Shows the exact field change and that tests were `NOT_RUN`.
4. **Not performed.** Lists what the static tool cannot know.

## Use in CI

```yaml
- run: npx migrasutra audit --root . --out migrasutra-report --fail high
- uses: actions/upload-artifact@v4
  if: always()
  with: { name: migrasutra-report, path: migrasutra-report }
```

`--fail high` exits 1 when any high finding exists.

## Track progress between runs

```bash
npx migrasutra scan --root . --out before.json
# fix issues
npx migrasutra scan --root . --out after.json
npx migrasutra compare --before before.json --after after.json --out diff.json
```

`REGRESSION` means a new high finding appeared.

## AI IDE skills

```bash
npx migrasutra skills --host claude --root .
```

Hosts: `claude`, `cursor`, `codex`, `gemini`, `copilot`, `generic`. Files are copied into the host's skill folder. The command refuses to overwrite and refuses symlinked targets. Whether the IDE then discovers and runs a skill depends on the IDE version and has not been verified here.

## Local report server

```bash
MIGRASUTRA_SERVER_TOKEN=use-a-long-random-value npx migrasutra serve --report artifacts/audit/audit.json --port 8787
```

Then call `GET http://127.0.0.1:8787/report` with `Authorization: Bearer <token>`.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Scan is stale` | `package.json` changed after the scan | Run scan again |
| `Target package is not declared` | Package missing from `package.json` | Declare it first |
| `SOURCE_NOT_READ` finding | Symlink or file over 1 MiB | Replace with a regular file |
| Symlink tests skipped on Windows | No symlink privilege | Enable Developer Mode; not required for normal use |
| `Missing value for --out` | Option without value | Pass a path |
