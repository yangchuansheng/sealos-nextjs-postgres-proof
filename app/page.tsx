import { listRecentProofEvents } from '../lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let status = 'Connected to PostgreSQL.';
  let events: Awaited<ReturnType<typeof listRecentProofEvents>> = [];

  try {
    events = await listRecentProofEvents(5);
  } catch (error) {
    status = error instanceof Error ? error.message : 'Unable to read PostgreSQL status.';
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Sealos content proof app</p>
        <h1>Next.js + PostgreSQL deployment proof</h1>
        <p>
          This container-ready app proves that a Sealos deployment can run Next.js, connect
          through DATABASE_URL, create a PostgreSQL table on startup, and read/write live data.
        </p>
      </section>

      <section className="panel">
        <h2>Runtime status</h2>
        <p className={events.length >= 0 ? 'status' : 'status error'}>{status}</p>
        <p className="hint">GET /api/proof returns recent records. POST /api/proof writes one.</p>
      </section>

      <section className="panel">
        <h2>Recent proof_events</h2>
        {events.length === 0 ? (
          <p className="empty">No proof events yet. POST a label to create the first record.</p>
        ) : (
          <ul className="events">
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.label}</strong>
                <span>{new Date(event.created_at).toISOString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
