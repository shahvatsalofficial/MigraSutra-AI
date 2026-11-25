# FAQ and glossary

Short answers in plain language.

## Is it safe to run on my repository?

It reads an allow-list of files and writes only where you point `--out`. Rehearsal uses a temp folder. It runs none of your code.

## Does it send my code anywhere?

No. The core has no network calls and there is no telemetry.

## Why does it never say my change is safe?

Safety depends on tests, data and recovery that the tool did not observe. The best verdict is `REVIEW_REQUIRED`.

## Why is my clean project still REVIEW_REQUIRED?

No static finding is not proof. A person still has to confirm tests and rollback.

## My migration is in another folder. Will it be found?

Only `migrations`, `db/migrations`, `prisma/migrations` and `database/migrations` are searched today.

## Does it support my database?

The SQL rules are generic patterns. They are not a parser for any dialect. The index rule is a PostgreSQL concern.

## Can I use it without an AI assistant?

Yes. The CLI works alone. The skills are optional.

## How do I silence a finding?

There is no suppression file yet. Record your decision in the pull request.

## Is it certified?

No. The audit in this documentation is a self-assessment that you can reproduce.

## Glossary

| Term | Meaning |
| --- | --- |
| Migration | A change that moves code, data or infrastructure from one state to another |
| Finding | One rule match with file, line and severity |
| Evidence ID | A stable identifier made from the rule, file and line |
| Baseline hash | SHA-256 of the file a plan was built on |
| Rehearsal | A practice run of the change on a copy. Here it covers the manifest edit only |
| Gate | The step that turns evidence into a verdict |
| Expand-contract | Add the new shape, move traffic, then remove the old shape later |
| Rollback | Returning to the earlier state |
| Forward fix | Repairing a failed change with a further change instead of reverting |
| Skill | A set of instructions an AI coding assistant can load |
