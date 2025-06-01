// app/api/tutor-dashboard/feedback-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) {
    return NextResponse.json({ message: 'tutorId query parameter is required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // Query 1: Overall stats (average rating, total reviews)
    const overallStatsQuery = `
      SELECT
        AVG(r.rating) AS average_rating,
        COUNT(r."reviewID") AS total_reviews
      FROM review r
      WHERE r."tutorID" = $1;
    `;
    // Note on column casing: Using r."tutorID" and r."reviewID" as per your image for the 'review' table.
    // If these columns are actually lowercase in your DB (e.g., tutorid, reviewid), remove the double quotes.

    const overallStatsResult = await client.query(overallStatsQuery, [tutorId]);
    const averageRating = overallStatsResult.rows[0]?.average_rating ? parseFloat(overallStatsResult.rows[0].average_rating) : 0;
    const totalReviews = overallStatsResult.rows[0]?.total_reviews ? parseInt(overallStatsResult.rows[0].total_reviews, 10) : 0;

    // Query 2: Rating distribution
    const ratingDistributionQuery = `
      SELECT
        r.rating,
        COUNT(r."reviewID") AS count
      FROM review r
      WHERE r."tutorID" = $1
      GROUP BY r.rating
      ORDER BY r.rating DESC;
    `;
    const ratingDistributionResult = await client.query(ratingDistributionQuery, [tutorId]);
    
    // Format rating distribution and calculate percentages
    const ratingDistributionData = [
        { stars: 5, count: 0, percentage: '0%' },
        { stars: 4, count: 0, percentage: '0%' },
        { stars: 3, count: 0, percentage: '0%' },
        { stars: 2, count: 0, percentage: '0%' },
        { stars: 1, count: 0, percentage: '0%' },
    ];

    ratingDistributionResult.rows.forEach(row => {
        const ratingValue = Math.round(parseFloat(row.rating)); // Ensure rating is an integer 1-5
        const starEntry = ratingDistributionData.find(entry => entry.stars === ratingValue);
        if (starEntry) {
            const count = parseInt(row.count, 10);
            starEntry.count = count;
            starEntry.percentage = totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(0) + '%' : '0%';
        }
    });
    

    // Query 3: Recent reviews with tutee details (e.g., last 5 reviews)
    // Assuming 'reviewID' can be used for ordering if no timestamp column like 'createdAt' exists.
    // If you have a timestamp, order by that for "recent".
    const recentReviewsQuery = `
      SELECT
        r.rating,
        r.comment,
        tf.firstname AS tutee_firstname,
        tf.lastname AS tutee_lastname
        -- tf.profileimg AS tutee_profileimg -- If you have a profile image for tutees
      FROM review r
      JOIN tuteeform tf ON r."tuteeID" = tf.tuteeid -- tf.tuteeid is lowercase as per your tuteeform image
      WHERE r."tutorID" = $1
      ORDER BY r."reviewID" DESC -- Or a timestamp column if available
      LIMIT 5; -- Fetch a certain number of recent reviews
    `;
    const recentReviewsResult = await client.query(recentReviewsQuery, [tutorId]);
    const recentFeedbacks = recentReviewsResult.rows.map(row => ({
        rating: parseFloat(row.rating),
        comment: row.comment,
        tuteeFirstName: row.tutee_firstname,
        tuteeLastName: row.tutee_lastname,
        // tuteeProfileImg: row.tutee_profileimg // If you fetch it
    }));

    const feedbackDetails = {
      averageRating: averageRating,
      totalReviews: totalReviews,
      ratingDistribution: ratingDistributionData,
      recentFeedbacks: recentFeedbacks,
    };

    return NextResponse.json(feedbackDetails, { status: 200 });

  } catch (error) {
    console.error('Error fetching tutor feedback details:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) errorMessage = error.message;
    // You can add more detailed error logging here if needed
    return NextResponse.json({ message: 'Error fetching feedback details', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}