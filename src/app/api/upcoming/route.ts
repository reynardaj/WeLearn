// app/api/upcoming/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(req: NextRequest) {
  const tuteeID = req.nextUrl.searchParams.get('tuteeID');

  if (!tuteeID) {
    return NextResponse.json({ error: 'Missing tuteeID' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    const res = await client.query(
      `SELECT "BookingID", "SubjectBooked", "StartTime", "EndTime", "Join_URL"
       FROM "booking"
       WHERE "tuteeID" = $1 AND "EndTime" >= NOW()
       ORDER BY "StartTime" ASC`,
      [tuteeID]
    );

    const sessions = res.rows.map(row => {
      const start = new Date(row.StartTime);
      const end = new Date(row.EndTime);
      return {
        id: row.BookingID,
        date: start.toLocaleDateString('en-GB', {
          day: '2-digit', month: 'long', year: 'numeric'
        }),
        time: `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        subject: row.SubjectBooked,
        joinUrl: row.Join_URL
      };
    });

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
