# Real-world scenarios

Seven situations teams meet every week. Each terminal below is produced by the real CLI on a small sample project when this site is built.

> The projects are illustrative, not customer stories. The commands, rules and output are real.

| # | Situation | Who cares | Result |
| --- | --- | --- | --- |
| 1 | A cleanup drops a column and a table | Developer, DBA | `NO_GO` |
| 2 | A new required column on a busy table | DBA, SRE | `REVIEW_REQUIRED` with warnings |
| 3 | A framework major upgrade | Developer | Safe rehearsal, `REVIEW_REQUIRED` |
| 4 | Builds that change on their own | Platform team | Pinning findings |
| 5 | Code changes after the scan | Reviewer | Plan refused |
| 6 | A pull request gate | CI owner | Exit code 1 |
| 7 | Proving the fix worked | Auditor | One finding resolved |

## 1. The Friday cleanup that drops a column

**Situation.** A developer tidies the schema late in the week. One migration removes a column and a table. An old report job still reads both.

<!-- term:s1 -->

**What to do.** Do not drop in the same release that stops using the data. Follow expand-contract:

<!-- html:expandContract -->

**Limit.** The tool cannot know who still reads the column. Search your consumers before you contract.

## 2. A new required column on a busy table

**Situation.** Product wants a mandatory `region` field. The migration adds it as `NOT NULL`, builds an index and renames a column in one step.

<!-- term:s2 -->

**Why it matters.** Adding a required column without a default fails on a table with rows. A plain index build can block writes on PostgreSQL. A rename breaks any server still running the old code.

**Safer version.**

```sql
ALTER TABLE customers ADD COLUMN region text;
-- backfill in batches, then add the constraint
CREATE INDEX CONCURRENTLY idx_region ON customers(region);
```

**Limit.** `CREATE INDEX CONCURRENTLY` is PostgreSQL syntax and cannot run inside a transaction. Check your engine.

## 3. Moving a web framework to a new major

**Situation.** A team wants to move `express` from 4 to 5 and needs a reviewable first step.

<!-- term:s3 -->

<!-- diagram:rehearse -->

**What to do.** Read the vendor upgrade notes, apply the change on a branch, install in an isolated environment and run your tests. The report lists these as prerequisites.

**Limit.** The rehearsal proves the manifest edit only. It does not prove the application works.

## 4. Builds that change on their own

**Situation.** The same commit builds differently on two days. Nothing in the code changed.

<!-- term:s4 -->

**What to do.** Pin the base image by digest, pin Python requirements with `==`, replace `latest` with a real version and commit a lockfile.

## 5. Someone edits the code after the scan

**Situation.** A reviewer approves a scan. Before the plan is created, a teammate changes `package.json`.

<!-- term:s5 -->

**Why it matters.** An approval should apply to the exact content that was reviewed. The hash mismatch stops the flow. Scan again.

## 6. Blocking a pull request in CI

**Situation.** A pipeline must stop destructive migrations before merge.

<!-- diagram:ci -->

<!-- term:s6 -->

```yaml
- run: npx migrasutra audit --root . --out migrasutra-report --fail high
- uses: actions/upload-artifact@v7
  if: always()
  with:
    name: migrasutra-report
    path: migrasutra-report
```

**What to do when a finding is intended.** There is no suppression file yet. Review the finding, record the approval in the pull request and run the step as advisory for that change.

## 7. Proving the fix worked

**Situation.** An auditor asks for proof that the risky statement is gone.

<!-- term:s7 -->

**Limit.** The comparison tracks findings by file, line and rule. Moving a statement to another line shows it as resolved and introduced.
