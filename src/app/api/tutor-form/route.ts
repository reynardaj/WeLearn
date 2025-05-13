import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// POST /api/tutor-form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Fields
    const firstName = body.firstName;
    const lastName = body.lastName;
    const institution = body.institution;
    const price = body.price;
    const profileImg = body.profileImg;
    const description = body.description;
    const experience = body.experience;
    const subjects = body.subjects;
    const certificateUrls = body.certificateUrls;
    const availability = body.availability;

    // Validate
    if (!firstName || !lastName || !price || !institution || !profileImg || !description || !experience) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Validate price
    if (price < 0) {
      return NextResponse.json({ error: 'Price invalid' }, { status: 400 });
    }

    // Insert to MsTutor
    const result = await pool.query(
      'INSERT INTO MsTutor (tutorID, firstName, lastName, price, institution, profileImg, description, experience) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING tutorID',
      [firstName, lastName, price, institution, profileImg, description, experience]
    );
    const tutorID = result.rows[0].tutorid;

    // Insert to TutorAvailability
    let dayCount = 1;
    for (const day of availability) {
      if (day.length > 0 ) {
        for (const hour of day) {
          await pool.query(
            'INSERT INTO TutorAvailability (availabilityID, tutorID, day, startTime, endTime) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
            [tutorID, dayCount, hour.from, hour.to]
          )
        }
      }
      dayCount++;
    }

    // Insert to TutorCertificate
    if (certificateUrls.length > 0) {
      for (const certificateUrl of certificateUrls) {
        await pool.query(
          'INSERT INTO TutorCertificate (certificateID, tutorID, certificateLink) VALUES (gen_random_uuid(), $1, $2)',
          [tutorID, certificateUrl]
        )
      }
    }

    // Insert to TutorSubject
    for (const subject of subjects) {
      let subjectID = "";

      const subjectResult = await pool.query(
        'SELECT (subjectsID) FROM Subjects WHERE (subjects = $1)',
        [subject]
      )

      if (subjectResult.rows[0]) { // subject existed
        subjectID = subjectResult.rows[0].subjectsid;
      } else { // subject doesn't exist
        const subjectInsert = await pool.query(
          'INSERT INTO Subjects (subjectsID, subjects) VALUES (gen_random_uuid(), $1) RETURNING subjectsID',
          [subject]
        )
        subjectID = subjectInsert.rows[0].subjectsid;
      }

      await pool.query(
        'INSERT INTO TutorSubjects (tutorID, subjectsID) VALUES ($1, $2)',
        [tutorID, subjectID]
      )
    }

    // Insert to User
    const { userId } = await auth();
    console.log(userId)
    if (userId) {
      await pool.query(
        'UPDATE user (tutorID) VALUES ($1) WHEN userID=($2)',
        [tutorID, userId]
      );
    }

    return NextResponse.json({ tutor: tutorID }, { status: 201 });

  } catch (error) {
    console.error('Error registering tutor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}