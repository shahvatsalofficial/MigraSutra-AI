import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scanRepository } from '../packages/core/index.mjs';

// Labeled corpus: `expect` is the correct answer for a human reviewer, `known` marks documented limitations.
export const CORPUS = [
  { name: 'drop in line comment', sql: '-- DROP TABLE a;\nSELECT 1;', expect: [] },
  { name: 'drop in block comment', sql: '/* DROP TABLE a; */ SELECT 1;', expect: [] },
  { name: 'drop inside string literal', sql: "INSERT INTO t VALUES ('DROP TABLE x;');", expect: [] },
  { name: 'drop table if exists', sql: 'DROP TABLE IF EXISTS tmp_a;', expect: ['SQL_DROP_TABLE'] },
  { name: 'delete with where', sql: 'DELETE FROM t WHERE id=1;', expect: [] },
  { name: 'delete without where', sql: 'DELETE FROM t;', expect: ['SQL_DELETE_UNSCOPED'] },
  { name: 'not null with default', sql: 'ALTER TABLE t ADD COLUMN a int NOT NULL DEFAULT 1;', expect: [] },
  { name: 'nullable add column', sql: 'ALTER TABLE t ADD COLUMN a int;', expect: [] },
  { name: 'not null without default', sql: 'ALTER TABLE t ADD COLUMN a int NOT NULL;', expect: ['SQL_NOT_NULL_NO_DEFAULT'] },
  { name: 'truncate', sql: 'TRUNCATE t;', expect: ['SQL_TRUNCATE'] },
  { name: 'lowercase drop column', sql: 'alter table t drop column a;', expect: ['SQL_DROP_COLUMN'] },
  { name: 'multiline drop column', sql: 'ALTER TABLE t\n  DROP COLUMN a;', expect: ['SQL_DROP_COLUMN'] },
  { name: 'rename column', sql: 'ALTER TABLE t RENAME COLUMN a TO b;', expect: ['SQL_RENAME'] },
  { name: 'index without concurrently', sql: 'CREATE INDEX i ON t(a);', expect: ['SQL_INDEX_NOT_CONCURRENT'] },
  { name: 'index concurrently', sql: 'CREATE INDEX CONCURRENTLY i ON t(a);', expect: [] },
  // Documented false negative: dynamic SQL inside dollar-quoted bodies is not parsed.
  { name: 'dollar-quoted dynamic drop (known limitation)', sql: "DO $$ BEGIN EXECUTE 'DROP TABLE a'; END $$;", expect: ['SQL_DROP_TABLE'], known: true }
];

for (const c of CORPUS) {
  test(`sql corpus: ${c.name}`, () => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'migrasutra-corpus-'));
    try {
      fs.mkdirSync(path.join(d, 'migrations'));
      fs.writeFileSync(path.join(d, 'migrations', 'a.sql'), c.sql);
      const got = scanRepository(d).findings.map(f => f.code).sort();
      if (c.known) assert.notDeepEqual(got, c.expect, 'limitation was fixed: remove the known flag and update docs');
      else assert.deepEqual(got, [...c.expect].sort());
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
}
