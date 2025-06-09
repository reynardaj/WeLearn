import { NextResponse, NextRequest } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const tuteeID = req.nextUrl.searchParams.get('tuteeID');
  if (!tuteeID) {
    return NextResponse.json({ error: "Missing tuteeID" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
WITH tutesub AS (
  SELECT subjectsid
    FROM tuteesubjects
   WHERE tuteeid = $1
),
eligible AS (
  SELECT
    t."tutorid",
    t."firstname",
    t."lastname",
    t."institution",
    t."price",
    t."profileimg",
    t."isPro",
    COALESCE(r_stats.avg_rating, 0)::real AS rating,
    array_agg(DISTINCT s."subjects")     AS subjects,
    json_agg(
      json_build_object(
      'day', a."day",
      'startTime', a."starttime",
      'endTime', a."endtime"
      )
    ) AS availability
  FROM "mstutor" t
  LEFT JOIN (
    SELECT "tutorID", AVG("rating") AS avg_rating
      FROM "review"
     GROUP BY "tutorID"
  ) AS r_stats
    ON r_stats."tutorID" = t."tutorid"
  LEFT JOIN "tutorsubjects" ts
    ON ts."tutorid" = t."tutorid"
  LEFT JOIN "subjects" s
    ON s."subjectsid" = ts."subjectsid"
  LEFT JOIN "tutoravailability" a
    ON a."tutorid" = t."tutorid"
  GROUP BY t."tutorid", t."firstname", t."lastname", t."institution",
    t."price", t."profileimg", t."isPro", r_stats.avg_rating
),
matched AS (
  SELECT
    e.*,
    EXISTS (
      SELECT 1
        FROM "tutorsubjects" ts2
        WHERE ts2."tutorid" = e."tutorid"
        AND ts2."subjectsid" IN (SELECT subjectsid FROM tutesub)
    ) AS matches_tutee_subjects
  FROM eligible e
),
numbered AS (
  SELECT
    *,
    ROW_NUMBER() OVER (
      ORDER BY
        (CASE WHEN "isPro" AND matches_tutee_subjects THEN 0 ELSE 1 END),
        rating DESC
    ) AS ord
  FROM matched
)
SELECT
  "tutorid",
  "firstname",
  "lastname",
  "institution",
  "price",
  "profileimg",
  (ord = 1) AS "isPro",
  rating,
  subjects,
  availability
FROM numbered
ORDER BY ord;
`,
      [tuteeID]
    );

    return NextResponse.json({ tutors: result.rows }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
