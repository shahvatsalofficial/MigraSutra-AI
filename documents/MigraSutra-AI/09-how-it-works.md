# How it works

MigraSutra turns a repository into reviewable evidence in five steps. Nothing from your project is ever executed.

## The whole flow

<!-- diagram:pipeline -->

<!-- html:lifecycle -->

## Step 1: Scan

The scanner reads only an allow-list of files. It refuses symbolic links and files over 1 MiB, and hashes everything it reads.

<!-- html:coverage -->

## Step 2: Check SQL

Comments and quoted strings are blanked first, so a `DROP TABLE` inside a comment is not reported.

<!-- diagram:sqlscan -->

<!-- bars:rules -->

## Step 3: Plan one change

You name the target, such as `npm:express@5.0.0` or `node:22`. The plan records the old value, the new value and the hash of the file it was based on.

## Step 4: Rehearse safely

<!-- diagram:rehearse -->

## Step 5: Gate

<!-- diagram:verdict -->

<!-- html:verdicts -->

## Reading a report

Findings are sorted from high to low. The chart below comes from the bundled risky sample.

<!-- bars:severity -->

Open the [risky sample report](evidence/samples/audit-risky.html) to see the full layout.

## Safe schema changes

<!-- html:expandContract -->

## With an AI coding assistant

The 20 skills tell an assistant how to run the CLI and how to treat evidence. They do not replace the CLI output.

<!-- diagram:skills -->

## What never happens

<!-- html:trust -->
