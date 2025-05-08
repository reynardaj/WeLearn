import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';

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
          console.log(hour.from)
          console.log(hour.to)
          await pool.query(
            'INSERT INTO TutorAvailability (availabilityID, tutorID, day, startTime, endTime) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
            [tutorID, dayCount, hour.from, hour.to]
          )
        }
        dayCount++;
      }
    }

    // Insert to TutorCertificate
    console.log(certificateUrls.length);
    if (certificateUrls.length > 0) {
      for (const certificateUrl of certificateUrls) {
        await pool.query(
          'INSERT INTO TutorCertificate (certificateID, tutorID, certificateLink) VALUES (gen_random_uuid(), $1, $2)',
          [tutorID, certificateUrl]
        )
      }
    }

    // Insert to User
    // const result2 = await pool.query(
    //   'UPDATE user (tutorID) VALUES ($1) WHEN userID=___ RETURNING *',
    //   [tutorID]
    // );

    return NextResponse.json({ tutor: tutorID }, { status: 201 });

  } catch (error) {
    console.error('Error registering tutor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}