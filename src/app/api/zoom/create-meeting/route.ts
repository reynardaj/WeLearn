import { NextResponse } from "next/server";
import { ZoomAPI } from "@/lib/zoom";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const zoom = ZoomAPI.getInstance();

    // Default meeting settings
    const meetingData = {
      topic: body.topic || "New Meeting",
      type: 2, // Scheduled meeting
      start_time: body.start_time || new Date().toISOString(),
      duration: body.duration || 60, // 60 minutes
      timezone: body.timezone || "Asia/Jakarta",
      password: body.password || "123456",
    };

    const meeting = await zoom.createMeeting(meetingData);

    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        join_url: meeting.join_url,
        start_url: meeting.start_url,
        topic: meeting.topic,
        start_time: meeting.start_time,
        duration: meeting.duration,
      },
    });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
