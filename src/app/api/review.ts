// pages/api/reviews.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { tutorID, tuteeID, rating, comment } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO review("tutorID","tuteeID","rating","comment")
         VALUES ($1,$2,$3,$4)
         RETURNING *`,
        [tutorID, tuteeID, rating, comment]
      );
      return res.status(201).json({ review: result.rows[0] });
    } catch (error) {
      console.error('DB insert error', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
