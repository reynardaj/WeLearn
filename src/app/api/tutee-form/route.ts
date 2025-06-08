import { NextRequest, NextResponse } from 'next/server';  
import { Pool } from 'pg';  

const pool = new Pool({  
  connectionString: process.env.DATABASE_URL,  
  ssl: {  
    rejectUnauthorized: false
  }  
});  

export async function POST(req: NextRequest) {  
  const client = await pool.connect();  

  const body = await req.json();

  try {   
    console.log('Received body:', JSON.stringify(body, null, 2));  
 
    if (!body.education) {  
      return NextResponse.json({  
        message: 'Education is required',  
        receivedData: body  
      }, { status: 400 });  
    }

    console.log('Inserting TuteeForm');  
    const tuteeResult = await client.query(  
      `INSERT INTO TuteeForm (TuteeID, Education, MinBudget, MaxBudget)  
       VALUES (gen_random_uuid(), $1, $2, $3)  
       RETURNING TuteeID`,  
      [body.education, body.minBudget, body.maxBudget]  
    );  
    
    const tuteeId = tuteeResult.rows[0].tuteeid;  
    console.log('Inserted TuteeForm with ID:', tuteeId);  
 
    if (body.subjects && body.subjects.length > 0) {  
      console.log('Attempting to insert subjects:', body.subjects);  
      for (const subject of body.subjects) {  
        try {   
          const subjectResult = await client.query(  
            `INSERT INTO subjects (subjects, subjectsid)  
             VALUES ($1, gen_random_uuid())   
             ON CONFLICT (subjects) DO NOTHING   
             RETURNING subjectsid`,  
            [subject]  
          );  
    
          const existingSubject = await client.query(  
            `SELECT subjectsid FROM subjects WHERE subjects = $1`,  
            [subject]  
          );  
    
          const subjectId = existingSubject.rows[0]?.subjectsid;  
    
          if (!subjectId) {  
            console.error(`Could not find SubjectsID for ${subject}`);  
            continue;  
          }  
      
          await client.query(  
            `INSERT INTO tuteesubjects (subjectsid, tuteeid)  
             VALUES ($1, $2)`,  
            [subjectId, tuteeId]  
          );  
    
          console.log(`Successfully inserted subject: ${subject}`);  
          console.log('Existing Subjects:', subjectResult.rows);  
        } catch (subjectError) {  
          console.error(`Detailed error for subject ${subject}:`, subjectError);  
        }  
      }  
    }    
    
    if (body.days && body.days.length > 0) {  
      console.log('Attempting to insert days:', body.days);  
      for (const day of body.days) {   
        try {  
          const dayResult = await client.query(  
            `INSERT INTO days (days, daysid)  
             VALUES ($1, gen_random_uuid())  
             ON CONFLICT (days) DO NOTHING  
             RETURNING daysid`,  
            [day]  
          );  
    
          const existingDay = await client.query(  
            `SELECT daysid FROM days WHERE days = $1`,  
            [day]  
          );  
    
          const dayId = existingDay.rows[0]?.daysid;  
    
          if (!dayId) {  
            console.error(`Could not find DaysID for ${day}`);  
            continue;  
          }  
    
          await client.query(  
            `INSERT INTO tuteedays (daysid, tuteeid)  
            VALUES ($1, $2)`,  
            [dayId, tuteeId]  
          );  
          console.log(`Successfully inserted day: ${day}`);  
          console.log('Existing Days:', dayResult.rows); 
        } catch (dayError) {  
          console.error(`Error inserting day ${day}:`, dayError);  
        }  
      }  
    }  

    if (body.times && body.times.length > 0) {  
      console.log('Attempting to insert times:', body.times);  
      for (const time of body.times) {   
        try {  
          const timeResult = await client.query(  
            `INSERT INTO times (times, timesid)  
             VALUES ($1, gen_random_uuid())   
             ON CONFLICT (times) DO NOTHING  
             RETURNING timesid`,  
            [time]  
          );  
    
          const existingTime = await client.query(  
            `SELECT timesid FROM times WHERE times = $1`,  
            [time]  
          );  
    
          const timeId = existingTime.rows[0]?.timesid;  
    
          if (!timeId) {  
            console.error(`Could not find TimesID for ${time}`);  
            continue;  
          }  
    
          await client.query(  
            `INSERT INTO tuteetimes (timesid, tuteeid)  
            VALUES ($1, $2)`,  
            [timeId, tuteeId]  
          );  
          console.log(`Successfully inserted time: ${time}`); 
          console.log('Existing Times:', timeResult.rows);  
        } catch (timeError) {  
          console.error(`Error inserting time ${time}:`, timeError);  
        }  
      }  
    }  
   

    return NextResponse.json({   
      message: 'Form submitted successfully',   
      tuteeId   
    }, { status: 200 });  
  } catch (error) {  
    console.error('Detailed submission error:', error);  
    return NextResponse.json({   
      message: 'Error submitting form',   
      error: error instanceof Error ? error.message : String(error),  
      receivedBody: body  
    }, { status: 500 });  
  } finally {  
    client.release();  
  }  
}  