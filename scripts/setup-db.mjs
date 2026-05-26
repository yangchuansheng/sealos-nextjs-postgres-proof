import pg from 'pg';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is required to initialize proof_events.');
  process.exit(1);
}

const client = new Client({ connectionString });

try {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS proof_events (
      id SERIAL PRIMARY KEY,
      label TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('proof_events table is ready.');
} catch (error) {
  console.error('Database setup failed:', error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}
