import { NextRequest, NextResponse } from 'next/server';
import { createProofEvent, listRecentProofEvents } from '../../../lib/db';

export const dynamic = 'force-dynamic';

type ProofPayload = {
  label?: unknown;
};

export async function GET() {
  try {
    const events = await listRecentProofEvents();
    return NextResponse.json({ ok: true, events });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let payload: ProofPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Request body must be JSON.' }, { status: 400 });
  }

  const label = typeof payload.label === 'string' ? payload.label.trim() : '';

  if (!label) {
    return NextResponse.json({ ok: false, error: 'label is required.' }, { status: 400 });
  }

  try {
    const event = await createProofEvent(label.slice(0, 200));
    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
