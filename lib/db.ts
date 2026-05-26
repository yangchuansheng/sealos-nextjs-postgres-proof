import { Pool } from 'pg';

export type ProofEvent = {
  id: number;
  label: string;
  created_at: string;
};

declare global {
  var proofPool: Pool | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return databaseUrl;
}

export function getPool() {
  if (!globalThis.proofPool) {
    globalThis.proofPool = new Pool({ connectionString: getDatabaseUrl() });
  }

  return globalThis.proofPool;
}

export async function listRecentProofEvents(limit = 10) {
  const { rows } = await getPool().query<ProofEvent>(
    `SELECT id, label, created_at
     FROM proof_events
     ORDER BY created_at DESC, id DESC
     LIMIT $1`,
    [limit]
  );

  return rows;
}

export async function createProofEvent(label: string) {
  const { rows } = await getPool().query<ProofEvent>(
    `INSERT INTO proof_events (label)
     VALUES ($1)
     RETURNING id, label, created_at`,
    [label]
  );

  return rows[0];
}
